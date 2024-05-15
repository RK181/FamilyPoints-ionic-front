import { IonAccordion, IonAccordionGroup, IonAlert, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonModal, IonNote, IonPage, IonPopover, IonRefresher, IonRefresherContent, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText, IonTitle, IonToast, IonToggle, IonToolbar, IonicSafeString, RefresherEventDetail, SearchbarInputEventDetail, setupIonicReact, useIonViewWillEnter } from '@ionic/react';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { GroupApi, Group, User, ValidationErrorResponse, Task, TaskApi } from '../api';
import { useApp } from '../context/AppContext';
import TaskInfo from './TaskInfo';
import { filterSharp, informationCircleOutline } from 'ionicons/icons';
import { getIcon } from '../constants/constants';
import './List.css';

const TaskList: React.FC = () => {
    const navigate = useHistory();
    const {apiConf, authEmail, setSession} = useApp();
    const [taskList, setTaskList] = useState<Task[]>();
    const [taskSearchList, setSearchTaskList] = useState<Task[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [group, setGroup] = useState<Group>();
    const modal = useRef<HTMLIonModalElement>(null);
    // Toast
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastColor, setToastColor] = useState<string>('success');

    const [showInformation, setShowInformation] = useState(false);

    setupIonicReact({
        // For nested html in alert message
        innerHTMLTemplatesEnabled : true,
    });

    function errorhandler(error: any) {
        switch (error.response?.status) {
            case 404:
                setToastOpen(true);
                setToastMessage('No group found, please create a group first.');
                setToastColor('danger');
                navigate.push("/group");
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
                navigate.push("/group");
                break;
            default:
                setToastOpen(true);
                setToastMessage('An error occurred, please try again later.');
                setToastColor('danger');
                navigate.push('/group');
                break;
        }
    }
    
    useIonViewWillEnter(() => {
        load();
    });
    
    const load = async () => {
        setLoading(true);
        
        try {
            console.log('Senging recuest');
            var api = new GroupApi(apiConf);
            var response = await api.getGroup();
            setGroup(response.data);
            
            var apiT = new TaskApi(apiConf);
            var responseT = await apiT.getGroupTaskList();
            setTaskList(responseT.data);
            setSearchTaskList(responseT.data);
            console.log(responseT);

        } catch (error: any) {
            errorhandler(error);
        }finally {
            setLoading(false);
        }
    }

    function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
        setTimeout(() => {
          load();
          event.detail.complete();
        }, 0);
    }
    
    const approve = async (id: number) => {
        setLoading(true);
        
        try {
            var api = new TaskApi(apiConf);
            var response = await api.approveTaskById(id);
            setToastOpen(true);
            setToastMessage(response.data.message!);
            setToastColor('success');
            handleListChange(id, 'approve');

        } catch (error: any) {
            errorhandler(error);
        }finally {
            setLoading(false);
        }

    }

    const complite = async (id: number) => {
        setLoading(true);
        
        try {
            var api = new TaskApi(apiConf);
            var response = await api.completeTaskById(id);
            setToastOpen(true);
            setToastMessage(response.data.message!);
            setToastColor('success');
            handleListChange(id, 'complete');

        } catch (error: any) {
            errorhandler(error);
        }finally {
            setLoading(false);
        }

    }

    const validate = async (id: number) => {
        setLoading(true);
        
        try {
            var api = new TaskApi(apiConf);
            var response = await api.validateTaskById(id);
            setToastOpen(true);
            setToastMessage(response.data.message!);
            setToastColor('success');
            handleListChange(id, 'validate');

        } catch (error: any) {
            errorhandler(error);
        }finally {
            setLoading(false);
        }

    }

    const inValidate = async (id: number) => {
        setLoading(true);
        
        try {
            var api = new TaskApi(apiConf);
            var response = await api.inValidateTaskById(id);
            setToastOpen(true);
            setToastMessage(response.data.message!);
            setToastColor('success');
            handleListChange(id, 'invalidate');

        } catch (error: any) {
            errorhandler(error);
        }finally {
            setLoading(false);
        }

    }

    const remove = async (id: number) => {
        setLoading(true);
        
        try {
            var api = new TaskApi(apiConf);
            var response = await api.deleteTaskById(id);
            setToastOpen(true);
            setToastMessage(response.data.message!);
            setToastColor('success');
            handleListChange(id, 'remove');

        } catch (error: any) {
            errorhandler(error);
        }finally {
            setLoading(false);
        }

    }

    const handleListChange = (id: number, action: string) => {
        switch (action) {
            case 'approve':
                setSearchTaskList(taskList!.map(task => {
                    if (task.id === id) {
                        task.approve = true;
                        return task;
                    } else {
                        return task;
                    }
                }));
                break;
            case 'complete':
                setSearchTaskList(taskList!.map(task => {
                    if (task.id === id) {
                        if (group?.conf_t_validate === false) {
                            task.validate = true;
                        }
                        task.user!.email = authEmail; 
                        task.complete = true;
                        return task;
                    } else {
                        return task;
                    }
                }));
                break;
            case 'validate':
                setSearchTaskList(taskList!.map(task => {
                    if (task.id === id) {
                        task.validate = true;
                        return task;
                    } else {
                        return task;
                    }
                }));
                break;
            case 'invalidate':
                setSearchTaskList(taskList!.map(task => {
                    if (task.id === id) {
                        task.complete = false;
                        task.validate = false;
                        return task;
                    } else {
                        return task;
                    }
                }));
                break;
            case 'remove':
                setSearchTaskList(taskList!.filter((task) => task.id! !== id));
                break;
        }  
    };

    const handleInput = (ev: Event) => {
        let query = '';
        const target = ev.target as HTMLIonSearchbarElement;
        if (target) query = target.value!.toLowerCase();
    
        setSearchTaskList(taskList!.filter((reward) => reward.title!.toLowerCase().indexOf(query) > -1));
    };

    const filterList = (type: string) => {
        switch (type) {
            case 'myTasks':
                setSearchTaskList(taskList!.filter((task) => task.user?.email === authEmail));
                break;
            case 'coupleTasks':
                setSearchTaskList(taskList!.filter((task) => task.user?.email !== authEmail));
                break;
            case 'waitApproval':
                setSearchTaskList(taskList!.filter((task) => task.approve === false));
                break;
            case 'waitComplete':
                setSearchTaskList(taskList!.filter((task) => (task.approve === true && task.complete === false)));
                break;
            case 'waitValidate':
                setSearchTaskList(taskList!.filter((task) => (task.approve === true && task.complete === true && task.validate === false)));
                break;
            case 'all':
                setSearchTaskList(taskList);
                break;
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton></IonBackButton>
                    </IonButtons>
                    <IonTitle>Task List</IonTitle>
                    <IonButton slot="end" color={'dark'} fill="clear" onClick={() => setShowInformation(true)}>
                        <IonIcon icon={informationCircleOutline}></IonIcon>
                    </IonButton>
                    <IonAlert
                        mode='md'
                        isOpen={showInformation}
                        onDidDismiss={() => setShowInformation(false)}
                        header="Info. Task List"
                        message={new IonicSafeString(`
                        <p><b>Completed task</b></p>
                        <ul>
                            <li><small><b>Blue</b>: The task you have completed.</small></li>
                            <li><small><b>White</b>: The task your couple has completed.</small></li>
                            <li><small><b>Grey</b>: The task is not completed.</small></li>
                        </ul>
                        <p><b>Approve</b>: Approve the creation of the task to be able to complete.</p>
                        <p><b>Complite</b>: Complete the task and wait to be validated to receive earned points.</p>
                        <p><b>Validate</b>: Validate the completed task.</p>
                        <p><b>Invalidate</b>: Invalidate the completed task and remove to earned points.</p>
                        <p><small>*You can change the need of a specific step in group settings.</small></p>
                        `)}
                        buttons={["Close"]}
                    />
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar debounce={1000} onIonInput={(ev) => handleInput(ev)} ></IonSearchbar>
                    <IonButton id="open-custom-dialog" slot='end' fill='clear' style={{'--padding-start': '0.2em'}}><IonIcon icon={filterSharp}></IonIcon></IonButton>
                    <IonModal id='select-modal' ref={modal} trigger="open-custom-dialog">
                        <div className="wrapper">
                            <IonItemDivider color="light" className="ion-margin-button">
                                <IonLabel><h3>Filter by</h3></IonLabel>
                            </IonItemDivider>
                            <IonList>
                                <IonItem button detail={false} onClick={() => {filterList('myTasks'), modal.current?.dismiss(); }}>
                                    <IonLabel>My tasks</IonLabel>
                                </IonItem>
                                <IonItem button detail={false} onClick={() => {filterList('coupleTasks'), modal.current?.dismiss(); }}>
                                    <IonLabel>Couple tasks</IonLabel>
                                </IonItem>
                                <IonItem button detail={false} onClick={() => {filterList('waitApproval'), modal.current?.dismiss(); }}>
                                    <IonLabel>Wait approval</IonLabel>
                                </IonItem>
                                <IonItem button detail={false} onClick={() => {filterList('waitComplete'), modal.current?.dismiss(); }}>
                                    <IonLabel>Wait complete</IonLabel>
                                </IonItem>
                                <IonItem button detail={false} onClick={() => {filterList('waitValidate'), modal.current?.dismiss(); }}>
                                    <IonLabel>Wait validate</IonLabel>
                                </IonItem>
                                <IonItem button detail={false} onClick={() => {filterList('all'), modal.current?.dismiss(); }}>
                                    <IonLabel>All</IonLabel>
                                </IonItem>
                            </IonList>
                        </div>
                    </IonModal>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
                {taskSearchList?.map((task) => {
                    return (
                        <IonAccordionGroup expand="inset" key={task.id}>
                            <IonAccordion>
                                <IonItem slot="header" color={task.user?.email === authEmail ? "secondary" : group?.couple?.email === task.user?.email ? "light" : "medium"}>
                                    <IonLabel>
                                    <h3>{task.title}</h3>
                                    <small>Reward: {task.reward} <IonIcon src={getIcon(group?.points_icon!)}></IonIcon></small> <br/>
                                    <small>Expire: {task.expire_at}</small>
                                    </IonLabel>
                                </IonItem>
                                <div slot="content">
                                    <TaskInfo group={group!} task={task} approve={approve} complete={complite} validate={validate} invalidate={inValidate} remove={remove} />
                                </div>
                            </IonAccordion>
                        </IonAccordionGroup>
                    );
                })}
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

export default TaskList;