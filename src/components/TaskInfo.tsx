import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonItem, IonItemDivider, IonLabel, IonNote, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { Task } from '../api';
import './TaskInfo.css'

interface Props {
    task: Task
}

const TaskInfo: React.FC<Props> = ({task}) => {

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
                    <IonButton slot="end" color={'danger'} >d</IonButton>

                    {!task.approve ? <IonButton color={'secondary'}>Approve</IonButton> 
                    :
                    !task.complete ? <IonButton color={'success'}>Complete</IonButton>
                    :
                    !task.validate ? <IonButton color={'tertiary'}>Validate</IonButton>
                    : <IonButton color={'warning'}>Invalidate</IonButton>}
                </IonItem>
            </IonCard>
    );
};

export default TaskInfo;