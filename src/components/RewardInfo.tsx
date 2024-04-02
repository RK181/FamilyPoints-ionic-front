import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonButton } from '@ionic/react';
import { Reward} from '../api';
import './TaskInfo.css'

interface Props {
    reward: Reward
    redeem: (id: number) => Promise<void>
    validate: (id: number) => Promise<void>
    remove: (id: number) => Promise<void>
}

const TaskInfo: React.FC<Props> = ({reward, redeem, validate, remove}) => {
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
                <IonButton slot="end" color={'danger'} onClick={() => remove(reward.id!)}>Delete</IonButton>
                {!reward.redeem ? <IonButton color={'secondary'} onClick={() => redeem(reward.id!)}>Redeem</IonButton> 
                :
                !reward.validate ? <IonButton color={'tertiary'} onClick={() => validate(reward.id!)}>Validate</IonButton>
                : <p>Validated</p>}
            </IonItem>
        </IonCard>
    );
};

export default TaskInfo;