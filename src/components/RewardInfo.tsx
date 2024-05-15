import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonButton, IonAlert } from '@ionic/react';
import { Group, Reward} from '../api';
import './TaskInfo.css'
import { useApp } from '../context/AppContext';
import { useState } from 'react';

interface Props {
    group: Group
    reward: Reward
    redeem: (id: number) => Promise<void>
    validate: (id: number) => Promise<void>
    remove: (id: number) => Promise<void>
}

const TaskInfo: React.FC<Props> = ({group, reward, redeem, validate, remove}) => {
    const {authEmail} = useApp();
    const [showConfirmation, setShowConfirmation] = useState(false);

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>
                    {reward.title}
                </IonCardTitle>
                <IonCardSubtitle>
                    <small>Creator: {reward.user?.name}</small><br/>
                    <small>Cost: {reward.cost}</small><br/>
                    <small>Status: 
                        {!reward.redeem ? 'Waiting redeem' 
                        :
                        !reward.validate ? 'Waiting validation'
                        : 'Completed'}
                    </small><br/>
                    <small>Expire: {reward.expire_at}</small><br/>
                </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>{reward.description}</IonCardContent>
            <IonItem>
                <IonButton
                    slot="end"
                    color="danger"
                    onClick={() => setShowConfirmation(true)}
                >
                    Delete
                </IonButton>
                <IonAlert
                    isOpen={showConfirmation}
                    onDidDismiss={() => setShowConfirmation(false)}
                    header="Confirmation"
                    message="Are you sure you want to delete this reward?"
                    buttons={[
                        {
                            text: "Cancel",
                            role: "cancel",
                            cssClass: "secondary",
                        },
                        {
                            text: "Delete",
                            handler: () => {
                                remove(reward.id!);
                            },
                        },
                    ]}
                />
                {!reward.redeem && reward.user?.email == authEmail ? <IonButton color={'success'} onClick={() => redeem(reward.id!)}>Redeem</IonButton>
                :
                reward.redeem && !reward.validate ? (reward.user?.email != authEmail || !group.conf_r_valiadte ? <IonButton color={'tertiary'} onClick={() => validate(reward.id!)}>Validate</IonButton> 
                                    : <p>Waiting validation</p>)
                : 
                reward.redeem && reward.validate ? <p>Validated</p>
                : <p>Waiting redeem</p>}
            </IonItem>
        </IonCard>
    );
};

export default TaskInfo;