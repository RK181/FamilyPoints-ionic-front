import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonItem, IonItemDivider, IonLabel, IonNote, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { Group, Task } from '../api';
import './TaskInfo.css'
import { useApp } from '../context/AppContext';

interface Props {
    group: Group
    task: Task
    approve: (id: number) => Promise<void>
    complete: (id: number) => Promise<void>
    validate: (id: number) => Promise<void>
    invalidate: (id: number) => Promise<void>
    remove: (id: number) => Promise<void>
}

const TaskInfo: React.FC<Props> = ({group, task, approve, complete, validate, invalidate, remove }) => {
    const {authEmail} = useApp();

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>
                    {task.title}
                </IonCardTitle>
                <IonCardSubtitle>
                    <small>Complite: {task.user?.name}</small><br/>
                    <small>Creator: {task.creator?.name}</small><br/>
                    <small>Reward: {task.reward}</small><br/>
                    <small>Status: 
                        {!task.approve ? 'Waiting approval' 
                        :
                        !task.complete ? 'Waiting completion'
                        :
                        !task.validate ? 'Waiting validation'
                        : 'Completed'}
                    </small><br/>
                    <small>Expire: {task.expire_at}</small><br/>
                </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>{task.description}</IonCardContent>
            <IonItem>
                <IonButton slot="end" color={'danger'} onClick={() => remove(task.id!)}>Delete</IonButton>

                {!task.approve ? (task.creator?.email != authEmail || !group.conf_t_approve ? <IonButton color={'secondary'} onClick={() => approve(task.id!)} >Approve</IonButton> 
                                    : <p>Waiting approval</p>)  
                :
                !task.complete ? <IonButton color={'success'} onClick={() => complete(task.id!)}>Complete</IonButton>
                :
                !task.validate ? (task.user?.email != authEmail || !group.conf_t_validate ? <IonButton color={'tertiary'} onClick={() => validate(task.id!)}>Validate</IonButton>
                                    : <p>Waiting validation</p>)
                : 
                group.conf_t_invalidate ? <IonButton color={'warning'} onClick={() => invalidate(task.id!)}>Invalidate</IonButton> : <p>Validated</p>}
            </IonItem>
        </IonCard>
    );
};

export default TaskInfo;