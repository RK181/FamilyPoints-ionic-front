import { IonAccordion, IonAccordionGroup, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonLoading, IonModal, IonNote, IonPage, IonPopover, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText, IonTitle, IonToggle, IonToolbar, SearchbarInputEventDetail, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { GroupApi, Group, User, ValidationErrorResponse, Task, TaskApi } from '../api';
import { useApp } from '../context/AppContext';
import { format, parseISO, subDays } from 'date-fns';
import { paw, pin, share, trash } from 'ionicons/icons';
import TaskInfo from './TaskInfo';

const TaskList: React.FC = () => {
    const navigate = useHistory();
    const {apiConf, isAuthenticated} = useApp();
    const [taskList, setTaskList] = useState<Task[]>();
    const [taskSearchList, setSearchTaskList] = useState<Task[]>();
    const [loading, setLoading] = useState<boolean>(true);
    
    useIonViewWillEnter(() => {
        load();
        console.log('Group reward list ionViewDidEnter event fired');
    });
    
    const load = async () => {
        setLoading(true);
        
        try {
            console.log('Senging recuest');
            
            var api = new TaskApi(apiConf);
            
            var response = await api.getGroupTaskList();

            setTaskList(response.data);
            setSearchTaskList(response.data);
            console.log(response);

        } catch (error: any) {
            console.log("Key:" +apiConf!.accessToken);

            if (error.response?.status == 404) {
                navigate.push("/group");
                console.log('No group found');

            }
            else if (error.response?.status == 401) {
                navigate.push("/login");
            }

        }finally {
            setLoading(false);
        }

    }

    const approve = async (id: number) => {
        setLoading(true);
        
        try {
            console.log('Senging request');
            
            var api = new TaskApi(apiConf);
            var response = await api.approveTaskById(id);
            console.log(response.data);

        } catch (error: any) {
            console.log("Key:" +apiConf!.accessToken);

            if (error.response?.status == 404) {
                navigate.push("/group");
                console.log('No group found');

            }
            else if (error.response?.status == 401) {
                navigate.push("/login");
            }

        }finally {
            setLoading(false);
        }

    }

    const complite = async (id: number) => {
        setLoading(true);
        
        try {
            console.log('Senging request');
            
            var api = new TaskApi(apiConf);
            var response = await api.completeTaskById(id);
            console.log(response.data);

        } catch (error: any) {
            console.log("Key:" +apiConf!.accessToken);

            if (error.response?.status == 404) {
                navigate.push("/group");
                console.log('No group found');

            }
            else if (error.response?.status == 401) {
                navigate.push("/login");
            }

        }finally {
            setLoading(false);
        }

    }

    const validate = async (id: number) => {
        setLoading(true);
        
        try {
            console.log('Senging recuest');
            
            var api = new TaskApi(apiConf);
            var response = await api.validateTaskById(id);
            console.log(response.data);

        } catch (error: any) {
            console.log("Key:" +apiConf!.accessToken);

            if (error.response?.status == 404) {
                navigate.push("/group");
                console.log('No group found');

            }
            else if (error.response?.status == 401) {
                navigate.push("/login");
            }

        }finally {
            setLoading(false);
        }

    }

    const inValidate = async (id: number) => {
        setLoading(true);
        
        try {
            console.log('Senging recuest');
            
            var api = new TaskApi(apiConf);
            var response = await api.inValidateTaskById(id);
            console.log(response.data);

        } catch (error: any) {
            console.log("Key:" +apiConf!.accessToken);

            if (error.response?.status == 404) {
                navigate.push("/group");
                console.log('No group found');

            }
            else if (error.response?.status == 401) {
                navigate.push("/login");
            }

        }finally {
            setLoading(false);
        }

    }

    const remove = async (id: number) => {
        setLoading(true);
        
        try {
            console.log('Senging recuest');
            
            var api = new TaskApi(apiConf);
            var response = await api.deleteTaskById(id);
            console.log(response.data);

        } catch (error: any) {
            console.log("Key:" +apiConf!.accessToken);

            if (error.response?.status == 404) {
                navigate.push("/group");
                console.log('No group found');

            }
            else if (error.response?.status == 401) {
                navigate.push("/login");
            }

        }finally {
            setLoading(false);
        }

    }
    const handleInput = (ev: Event) => {
        let query = '';
        const target = ev.target as HTMLIonSearchbarElement;
        if (target) query = target.value!.toLowerCase();
    
        setSearchTaskList(taskList!.filter((reward) => reward.title!.toLowerCase().indexOf(query) > -1));
      };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton></IonBackButton>
                    </IonButtons>
                    <IonTitle>Task List</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
                <IonSearchbar debounce={1000} onIonInput={(ev) => handleInput(ev)}></IonSearchbar>
                {taskSearchList?.map((task) => {
                    return (
                        <IonAccordionGroup expand="inset">
                            <IonAccordion value={''+task.id} >
                                <IonItem slot="header" color="primary">
                                    <IonLabel>
                                    <h3>{task.title}</h3>
                                    <small>Reward: {task.reward}</small> <br/>
                                    <small font-size="2">Expire: {task.expire_at}</small>
                                    </IonLabel>
                                </IonItem>
                                <div slot="content">
                                    <TaskInfo task={task} />
                                </div>
                            </IonAccordion>
                        </IonAccordionGroup>
                    );
                })}
            </IonContent>
        </IonPage>
    );
};

export default TaskList;