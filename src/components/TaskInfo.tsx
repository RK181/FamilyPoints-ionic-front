import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonItem, IonItemDivider, IonLabel, IonNote, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { Task } from '../api';
import './TaskInfo.css'

interface Props {
    task: Task
    approve: (id: number) => Promise<void>
    complete: (id: number) => Promise<void>
    validate: (id: number) => Promise<void>
    invalidate: (id: number) => Promise<void>
    remove: (id: number) => Promise<void>
}

const TaskInfo: React.FC<Props> = ({task, approve, complete, validate, invalidate, remove }) => {

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

                {!task.approve ? <IonButton color={'secondary'} onClick={() => approve(task.id!)} >Approve</IonButton> 
                :
                !task.complete ? <IonButton color={'success'} onClick={() => complete(task.id!)}>Complete</IonButton>
                :
                !task.validate ? <IonButton color={'tertiary'} onClick={() => validate(task.id!)}>Validate</IonButton>
                : 
                <IonButton color={'warning'} onClick={() => invalidate(task.id!)}>Invalidate</IonButton>}
            </IonItem>
        </IonCard>
    );
};

export default TaskInfo;