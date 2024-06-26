import { IonAlert, IonBackButton, IonButton, IonButtons, IonCardContent, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonLoading, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToast, IonToggle, IonToolbar, IonicSafeString, setupIonicReact } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { GroupApi, Group, User, ValidationErrorResponse, Reward, RewardApi } from '../api';
import { useApp } from '../context/AppContext';
import { format, parseISO, subDays } from 'date-fns';
import { informationCircleOutline } from 'ionicons/icons';

const RewardCreateForm: React.FC = () => {
    const minDate = format(new Date(), 'yyyy-MM-dd');
    const navigate = useHistory();
    const {setSession, apiConf} = useApp();
    // Loading Animation
    const [loading, setLoading] = useState<boolean>(false);
    // Form variabels
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [points, setPoints] = useState<number>(0);
    const [expire, setExpire] = useState<string>("");
    const [formErrors, setFormErrors] = useState<ValidationErrorResponse>();
    // Toast
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastColor, setToastColor] = useState<string>('success');
    // Alert
    const [showInformation, setShowInformation] = useState(false);

    setupIonicReact({
        // For nested html in alert message
        innerHTMLTemplatesEnabled : true,
    });

    const submit = async (event: any) => {
        event.preventDefault();
        setLoading(true);

        try {
            var api = new RewardApi(apiConf);

            var response = await api.createReward({
                title: title,
                description: description,
                cost: points,
                expire_at: format(parseISO(expire === "" ? minDate : expire), 'dd/MM/yyyy')
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
                    setSession!(false, '', '');
                    navigate.push('/login');
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
                    navigate.push('/group');
                    break;
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton></IonBackButton>
                    </IonButtons>
                    <IonTitle>Add Reward</IonTitle>
                    <IonButton slot="end" color={'dark'} fill="clear" onClick={() => setShowInformation(true)}>
                        <IonIcon icon={informationCircleOutline}></IonIcon>
                    </IonButton>
                    <IonAlert
                        mode='md'
                        isOpen={showInformation}
                        onDidDismiss={() => setShowInformation(false)}
                        header="Info. Create Reward"
                        message={new IonicSafeString(`
                        <p><b>Title</b>: The title of the reward.</p>
                        <p><b>Description</b>: The description of the reward, what the user will get.</p>
                        <p><b>Cost</b>: Points that will be used to redeem the reward.</p>
                        <p><b>Expire</b>: The day to get the reward.</p>
                        `)}
                        buttons={["Close"]}
                    />
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCardContent>
                    <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
                    <IonRow >
                        <IonCol >
                        <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
                        <form onSubmit={submit} >
                            <IonInput
                                className={`
                                ${formErrors?.errors?.title ? 'ion-invalid ion-touched' : null}
                                `}
                                mode="md"
                                type="text"
                                fill="outline"
                                label="Title"
                                labelPlacement="floating"
                                onIonInput={(e) => setTitle(e.detail.value!)}
                                errorText={`${formErrors?.errors?.title ?? ''} `}
                                required
                            ></IonInput>
                            <IonInput 
                                className={`
                                ${formErrors?.errors?.description ? 'ion-margin-top ion-invalid ion-touched' : 'ion-margin-top'}
                                `}
                                mode="md"
                                type="text"
                                fill="outline"
                                label="Description"
                                labelPlacement="floating"
                                onIonInput={(e) => setDescription(e.detail.value!)}
                                errorText={`${formErrors?.errors?.description ?? ''} `}
                                required
                            ></IonInput>
                            <IonInput
                                className={`
                                ${formErrors?.errors?.cost ? 'ion-margin-top ion-invalid ion-touched' : 'ion-margin-top'}
                                `}
                                mode="md"
                                type="number"
                                fill="outline"
                                label="Cost in points"
                                labelPlacement="floating"
                                onIonInput={(e) => setPoints(e.detail.value as any)}
                                errorText={`${formErrors?.errors?.cost ?? ''} `}
                                placeholder="0"
                                required
                            ></IonInput>
                            <IonDatetimeButton datetime="datetime" className="ion-margin-top"></IonDatetimeButton>

                            <IonModal keepContentsMounted={true}>
                            <IonDatetime id="datetime" presentation="date" value={minDate as string} min={minDate as string} onIonChange={(e) => setExpire(e.detail.value as string)} ></IonDatetime>
                            </IonModal>

                            <IonButton type='submit' expand="block" color='success' className="ion-margin-top" >
                                Create Reward
                            </IonButton>
                        </form>
                        </IonCol>
                    </IonRow>
                    
                </IonCardContent>
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

export default RewardCreateForm;