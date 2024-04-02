import { IonBackButton, IonButton, IonButtons, IonCardContent, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonLoading, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToggle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { GroupApi, Group, User, ValidationErrorResponse, TaskApi } from '../api';
import { useApp } from '../context/AppContext';
import { format, parseISO, subDays } from 'date-fns';

const TaskCreateForm: React.FC = () => {
    const minDate = format(new Date(), 'yyyy-MM-dd');
    const navigate = useHistory();
    const {isAuthenticated, apiConf} = useApp();
    // Loading Animation
    const [loading, setLoading] = useState<boolean>(false);
    // Form variabels
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [reward, setReward] = useState<number>(0);
    const [expire, setExpire] = useState<string>("1990-01-01");
    const [formErrors, setFormErrors] = useState<any>();

    const submit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        console.log('ionViewDidEnter event fired');


        try {
            var api = new TaskApi(apiConf);
            //console.log(format(parseISO(expire), 'dd/MM/yyyy'));

            await api.createTask({
                title: title,
                description: description,
                reward: reward,
                expire_at: format(parseISO(expire), 'dd/MM/yyyy')
            });
            //navigate.push("/group/reward/list");

        } catch (error: any) {
            if (error.response?.status == 400) {
                var err = error.response.data as ValidationErrorResponse;
                setFormErrors(err);
            }
            console.log(error);
            
            /*setFormErrors( (error.response &&
                error.response.data &&
                error.response.data.errors.email[0]) ||
              error.message ||
              error.toString());*/
            
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
                        <div>Auth: {isAuthenticated ? 'true':'false'}</div>
                        <form onSubmit={submit} >
                            <IonInput
                                mode="md"
                                type="text"
                                fill="outline"
                                label="Title"
                                labelPlacement="floating"
                                onIonChange={(e) => setTitle(e.detail.value!)}
                                //placeholder=""
                                required
                            ></IonInput>
                            <IonInput 
                                className="ion-margin-top"
                                mode="md"
                                type="text"
                                fill="outline"
                                label="Description"
                                labelPlacement="floating"
                                onIonChange={(e) => setDescription(e.detail.value!)}
                                //placeholder=""
                                required
                            ></IonInput>
                            <IonInput
                                className="ion-margin-top"
                                mode="md"
                                type="number"
                                fill="outline"
                                label="Reward"
                                labelPlacement="floating"
                                onIonChange={(e) => setReward(e.detail.value as any)}
                                placeholder="123"
                                required
                            ></IonInput>
                            <IonDatetimeButton datetime="datetime" className="ion-margin-top"></IonDatetimeButton>

                            <IonModal keepContentsMounted={true}>
                            <IonDatetime id="datetime" presentation="date" min={minDate as string}	onIonChange={(e) => setExpire(e.detail.value as string)} ></IonDatetime>
                            </IonModal>

                            
                            <div>{formErrors?.errors?.toString() ?? null} </div>


                            <IonButton type='submit' expand="block" color='success' className="ion-margin-top" >
                                Create Task
                            </IonButton>
                        </form>
                        </IonCol>
                    </IonRow>
                    
                </IonCardContent>
            </IonContent>
        </IonPage>
    );
};

export default TaskCreateForm;