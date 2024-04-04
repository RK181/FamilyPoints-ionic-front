import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonCol, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonLoading, IonModal, IonNote, IonPage, IonRow, IonSelect, IonSelectOption, IonThumbnail, IonTitle, IonToggle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
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

    const [formErrors, setFormErrors] = useState<ValidationErrorResponse>();

    useIonViewWillEnter(() => {
        load();
        console.log('ionViewDidEnter event fired');
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
            
            console.log("status:" + response.data.status + "| msg: " + response.data.message)
            navigate.push("/group");
        } catch (error: any) {
            if (error.response?.status == 400) {
                var err = error.response.data as ValidationErrorResponse;
                setFormErrors(err);
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
                            mode="md"
                            type="text"
                            fill="outline"
                            label="Group Name"
                            labelPlacement="floating"
                            onIonChange={(e) => setName(e.detail.value!)}
                            value={name}
                            required
                        ></IonInput>

                        <IonItemGroup className="ion-margin-top">
                            <IonItemDivider color="light">
                                <IonLabel>Points</IonLabel>
                            </IonItemDivider>
                            <IonItem>
                                <IonInput
                                    mode="md"
                                    type="text"
                                    label="Points Name:"
                                    onIonChange={(e) => setPointsName(e.detail.value!)}
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
                            <IonModal id='select-modal' ref={modal} trigger="open-custom-dialog">
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
                        <div>{formErrors?.errors?.toString() ?? null} </div>


                        <IonButton type='submit' expand="block" color='success' className="ion-margin-top" >
                            Update Group
                        </IonButton>
                    </form>
                    </IonCol>
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default GroupUpdateForm;