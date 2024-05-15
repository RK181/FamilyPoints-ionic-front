import { IonBackButton, IonButton, IonButtons, IonCardContent, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonLoading, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToast, IonToggle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { ValidationErrorResponse, TaskApi } from '../api';
import { useApp } from '../context/AppContext';
import { format, parseISO } from 'date-fns';

const TaskCreateForm: React.FC = () => {
    const minDate = format(new Date(), 'yyyy-MM-dd');
    const navigate = useHistory();
    const {apiConf, setSession} = useApp();
    // Loading Animation
    const [loading, setLoading] = useState<boolean>(false);
    // Form variabels
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [reward, setReward] = useState<number>(0);
    const [expire, setExpire] = useState<string>("");
    const [formErrors, setFormErrors] = useState<ValidationErrorResponse>();
    // Toast
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastColor, setToastColor] = useState<string>('success');

    const submit = async (event: any) => {
        event.preventDefault();
        setLoading(true);

        try {
            var api = new TaskApi(apiConf);

            var response = await api.createTask({
                title: title,
                description: description,
                reward: reward,
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
                    <IonTitle>Add Task</IonTitle>
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
                                mode="md"
                                type="text"
                                fill="outline"
                                label="Title"
                                labelPlacement="floating"
                                onIonInput={(e) => setTitle(e.detail.value!)}
                                required
                            ></IonInput>
                            <IonInput 
                                className="ion-margin-top"
                                mode="md"
                                type="text"
                                fill="outline"
                                label="Description"
                                labelPlacement="floating"
                                onIonInput={(e) => setDescription(e.detail.value!)}
                                required
                            ></IonInput>
                            <IonInput
                                className="ion-margin-top"
                                mode="md"
                                type="number"
                                fill="outline"
                                label="Reward"
                                labelPlacement="floating"
                                onIonInput={(e) => setReward(e.detail.value as any)}
                                placeholder="123"
                                required
                            ></IonInput>
                            <IonDatetimeButton datetime="datetime" className="ion-margin-top"></IonDatetimeButton>

                            <IonModal keepContentsMounted={true}>
                            <IonDatetime id="datetime" presentation="date" value={minDate as string }  min={minDate as string} onIonChange={(e) => setExpire(e.detail.value as string)} ></IonDatetime>
                            </IonModal>

                            
                            <IonText color={'danger'}>{formErrors?.errors?.toString() ?? ''} </IonText>


                            <IonButton type='submit' expand="block" color='success' className="ion-margin-top" >
                                Create Task
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

export default TaskCreateForm;