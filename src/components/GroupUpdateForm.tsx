import { IonAlert, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonCol, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonLoading, IonModal, IonNote, IonPage, IonRow, IonSelect, IonSelectOption, IonThumbnail, IonTitle, IonToast, IonToggle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import React, { useRef, useState } from 'react';
import { AuthApi, Group, GroupApi, ValidationErrorResponse } from '../api';
import { useApp } from '../context/AppContext';
import './GroupCreateForm.css';
import { appIcons, getIcon } from '../constants/constants';
import { useHistory } from 'react-router';

const GroupUpdateForm: React.FC = () => {
    const navigate = useHistory();

    const {isAuthenticated, apiConf} = useApp();
    // Loading Animation
    const [loading, setLoading] = useState<boolean>(false);
    // Form variabels
    const [name, setName] = useState<string>('');
    const [pointsName, setPointsName] = useState<string>('');
    const [pointsIcon, setPointsIcon] = useState<string>('1');
    const [requireTaskApprove, setReqTApprove] = useState<boolean>(true);
    const [requireTaskValidation, setReqTValidation] = useState<boolean>(true);
    const [permiteTaskInValidation, setPerTInValidation] = useState<boolean>(true);
    const [requireRewardValidation, setReqRValidation] = useState<boolean>(true);
    const modal = useRef<HTMLIonModalElement>(null);

    // Toast
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastColor, setToastColor] = useState<string>('success');


    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<ValidationErrorResponse>();

    useIonViewWillEnter(() => {
        load();
    });
    
    const load = async () => {
        setLoading(true);
        
        try {
            var api = new GroupApi(apiConf);
            var response = await api.getGroup();

            setName(response.data.name!);
            setPointsName(response.data.points_name!);
            setPointsIcon(response.data.points_icon!);
            setReqTApprove(response.data.conf_t_approve!);
            setReqTValidation(response.data.conf_t_validate!);
            setPerTInValidation(response.data.conf_t_invalidate!);
            setReqRValidation(response.data.conf_r_valiadte!);
        } catch (error: any) {
            console.log("Key:" +apiConf!.accessToken);

            if (error.response?.status == 404) {
                navigate.push("/group");

            }
            else if (error.response?.status == 401) {
                navigate.push("/login");
            }

        }finally {
            setLoading(false);
        }

    }

    const submit = async (event: any) => {
        event.preventDefault();
        setLoading(true);

        try {
            var api = new GroupApi(apiConf);
            const response = await api.updateGroup({
                name: name, 
                points_name: pointsName,
                points_icon: pointsIcon,
                conf_t_approve: requireTaskApprove,
                conf_t_validate: requireTaskValidation,
                conf_t_invalidate: permiteTaskInValidation,
                conf_r_valiadte: requireRewardValidation
            });
            
            setToastOpen(true);
            setToastMessage(response.data.message!);
            setToastColor('success');
            navigate.push("/group");
        } catch (error: any) {
            switch (error.response?.status) {
                case 400:
                    var err = error.response.data as ValidationErrorResponse;
                    setFormErrors(err);
                    break;
                case 401:
                    setToastOpen(true);
                    setToastMessage('The session has expired, please login again.');
                    setToastColor('danger');
                    navigate.push("/login");
                    break;
                case 404:
                    setToastOpen(true);
                    setToastMessage('No group found, please create a group first.');
                    setToastColor('danger');
                    navigate.push('/group');
                    break;
                case 500:
                    setToastOpen(true);
                    setToastMessage('Internal server error, please try again later.');
                    setToastColor('danger');
                    break;
                default:
                    setToastOpen(true);
                    setToastMessage('An error occurred, please try again later.');
                    setToastColor('danger');
                    break;
            }
        } finally {
            setLoading(false);
        }
    }

    const deleteGroup = async () => {
        setLoading(true);

        try {
            var api = new GroupApi(apiConf);
            const response = await api.deleteGroup();
            
            setToastOpen(true);
            setToastMessage(response.data.message!);
            setToastColor('success');
            navigate.push("/group");
        } catch (error: any) {
            switch (error.response?.status) {
                case 401:
                    setToastOpen(true);
                    setToastMessage('The session has expired, please login again.');
                    setToastColor('danger');
                    navigate.push("/login");
                    break;
                case 404:
                    setToastOpen(true);
                    setToastMessage('No group found, please create a group first.');
                    setToastColor('danger');
                    navigate.push('/group');
                    break;
                case 500:
                    setToastOpen(true);
                    setToastMessage('Internal server error, please try again later.');
                    setToastColor('danger');
                    break;
                default:
                    setToastOpen(true);
                    setToastMessage('An error occurred, please try again later.');
                    setToastColor('danger');
                    break;
            }
        } finally {
            setLoading(false);
        }
    }
    

    return (
        <IonPage>
            <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton></IonBackButton>
                    </IonButtons>
                    <IonTitle>Group Update</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonRow class="ion-justify-content-center">
                    <IonCol size="auto">
                    <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
                    <form onSubmit={submit} >
                        <IonInput
                            className={`${formErrors?.errors?.name ? 'ion-invalid ion-touched' : ''}`}
                            mode="md"
                            type="text"
                            fill="outline"
                            label="Group Name"
                            labelPlacement="floating"
                            onIonInput={(e) => setName(e.detail.value!)}
                            errorText={`${formErrors?.errors?.name ?? ''} `}
                            value={name}
                            required
                        ></IonInput>

                        <IonItemGroup className="ion-margin-top">
                            <IonItemDivider color="light">
                                <IonLabel>Points</IonLabel>
                            </IonItemDivider>
                            <IonItem>
                                <IonInput
                                    className={`${formErrors?.errors?.points_name ? 'ion-invalid ion-touched' : ''}`}
                                    mode="md"
                                    type="text"
                                    label="Points Name:"
                                    onIonInput={(e) => setPointsName(e.detail.value!)}
                                    errorText={`${formErrors?.errors?.points_name ?? ''} `}
                                    placeholder="..."
                                    value={pointsName}
                                    required
                                ></IonInput>
                            </IonItem>
                            <IonItem button id="open-custom-dialog">
                                <IonLabel>Icon:</IonLabel>
                                {pointsIcon ?
                                <IonIcon src={getIcon(pointsIcon)}></IonIcon>
                                :
                                <IonNote slot='end'>select icon</IonNote>
                                }
                            </IonItem>
                            <IonModal id='select-modal-icon' ref={modal} trigger="open-custom-dialog">
                                <div className="wrapper">
                                    <IonList lines="none">
                                        {appIcons.map((icon, index) => (
                                            <IonItem key={index} button={true} detail={false} onClick={() => {setPointsIcon(icon.name); modal.current?.dismiss(); }}>
                                                <IonIcon src={icon.img} />
                                            </IonItem>
                                        ))}
                                    </IonList>
                                </div>
                            </IonModal>
                            <IonItemDivider color="light" className="ion-margin-top">
                                <IonLabel>Settings</IonLabel>
                            </IonItemDivider>
                            <IonItem>
                                <IonToggle checked={requireTaskApprove} enableOnOffLabels={true} onIonChange={(e) => setReqTApprove(e.detail.checked!)}>Require Task Approve</IonToggle>
                            </IonItem>
                            <IonItem>
                                <IonToggle checked={requireTaskValidation} enableOnOffLabels={true} onIonChange={(e) => setReqTValidation(e.detail.checked!)}>Require Task Validation</IonToggle>
                            </IonItem>
                            <IonItem>
                                <IonToggle checked={permiteTaskInValidation} enableOnOffLabels={true} onIonChange={(e) => setPerTInValidation(e.detail.checked!)}>Permite Task Invalidation</IonToggle>
                            </IonItem>
                            <IonItem>
                                <IonToggle checked={requireRewardValidation} enableOnOffLabels={true} onIonChange={(e) => setReqRValidation(e.detail.checked!)}>Require Reward Validation</IonToggle>
                            </IonItem>
                        </IonItemGroup>

                        <IonButton type='submit' expand="block" color='warning' className="ion-margin-top" >
                            Update Group
                        </IonButton>
                        <IonButton
                            expand="block"
                            color="danger"
                            className="ion-margin-top"
                            onClick={() => setShowConfirmation(true)}
                        >
                            Delete Group
                        </IonButton>

                        <IonAlert
                            isOpen={showConfirmation}
                            onDidDismiss={() => setShowConfirmation(false)}
                            header="Confirmation"
                            message="Are you sure you want to delete this group?"
                            buttons={[
                                {
                                    text: "Cancel",
                                    role: "cancel",
                                    cssClass: "secondary",
                                },
                                {
                                    text: "Delete",
                                    handler: () => {
                                        deleteGroup();
                                    },
                                },
                            ]}
                        />
                    </form>
                    </IonCol>
                </IonRow>
                <IonToast
                    isOpen={toastOpen}
                    message={toastMessage}
                    color={toastColor}
                    onDidDismiss={() => setToastOpen(false)}
                    duration={5000}
                ></IonToast>
            </IonContent>
        </IonPage>
    );
};

export default GroupUpdateForm;