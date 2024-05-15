import { IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCol, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonLoading, IonModal, IonNote, IonPage, IonRow, IonSelect, IonSelectOption, IonThumbnail, IonTitle, IonToast, IonToggle, IonToolbar } from '@ionic/react';
import React, { useRef, useState } from 'react';
import { AuthApi, GroupApi, ValidationErrorResponse } from '../api';
import { useApp } from '../context/AppContext';
import { logoIonic, personCircle } from 'ionicons/icons';
import './GroupCreateForm.css';
import { appIcons, getIcon } from '../constants/constants';
import { useHistory } from 'react-router';

interface Props {
    reload: () => Promise<void>;
}

const GroupCreateForm: React.FC<Props> = ({reload}) => {
    const navigate = useHistory();

    const {apiConf, setSession} = useApp();
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

    const [formErrors, setFormErrors] = useState<ValidationErrorResponse>();


    const submit = async (event: any) => {
        event.preventDefault();
        setLoading(true);

        try {
            var api = new GroupApi(apiConf);
            const response = await api.createGroup({
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
            // Reload the group page
            reload();
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
                    setSession!(false, '', '');
                    navigate.push("/login");
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
        <IonRow class="ion-justify-content-center">
            <IonCol size="auto">
            <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
            <form onSubmit={submit} >
                <IonInput
                    className={`
                    ${formErrors?.errors?.name ? 'ion-invalid ion-touched' : null}
                    `}
                    mode="md"
                    type="text"
                    fill="outline"
                    label="Group Name"
                    labelPlacement="floating"
                    onIonInput={(e) => setName(e.detail.value!)}
                    errorText={`${formErrors?.errors?.name ?? ''} `} 
                    required
                ></IonInput>

                <IonItemGroup className="ion-margin-top">
                    <IonItemDivider color="light">
                        <IonLabel>Points</IonLabel>
                    </IonItemDivider>
                    <IonItem>
                        <IonInput
                            className={`
                            ${formErrors?.errors?.points_name ? 'ion-invalid ion-touched' : null}
                            `}
                            mode="md"
                            type="text"
                            label="Points Name:"
                            onIonInput={(e) => setPointsName(e.detail.value!)}
                            placeholder="..."
                            errorText={`${formErrors?.errors?.points_name ?? ''} `} 
                            required
                        ></IonInput>
                    </IonItem>
                    <IonItem button id="open-custom-dialog" className='ion-invalid ion-touched'> 
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
                                    <IonItem key={index} button={true} detail={false} onClick={() => {setPointsIcon(icon.name), modal.current?.dismiss(); }}>
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

                <IonButton type='submit' expand="block" color='success' className="ion-margin-top" >
                    Create Group
                </IonButton>
            </form>
            </IonCol>
            <IonToast
                isOpen={toastOpen}
                message={toastMessage}
                color={toastColor}
                onDidDismiss={() => setToastOpen(false)}
                duration={5000}
            ></IonToast>
        </IonRow>
        
    );
};

export default GroupCreateForm;