import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonItem, IonItemDivider, IonLabel, IonLoading, IonNote, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { Reward, RewardApi, Task } from '../api';
import './TaskInfo.css'
import { navigate } from 'ionicons/icons';
import { useApp } from '../context/AppContext';
import { useHistory } from 'react-router';

interface Props {
    reward: Reward
}

const TaskInfo: React.FC<Props> = ({reward}) => {
    const navigate = useHistory();
    const [loading, setLoading] = useState<boolean>(true);
    const {apiConf} = useApp();


    const redeem = async (id: number) => {
        setLoading(true);
        
        try {
            console.log('Senging recuest');
            
            var api = new RewardApi(apiConf);
            var response = await api.redeemReward(id);
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
            
            var api = new RewardApi(apiConf);
            var response = await api.validateReward(id);
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
            
            var api = new RewardApi(apiConf);
            var response = await api.deleteRewardById(id);
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

    return (
            <IonCard>
                <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
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
                    <IonButton slot="end" color={'danger'} >d</IonButton>

                    {!reward.redeem ? <IonButton color={'secondary'}>Redeem</IonButton> 
                    :
                    !reward.validate ? <IonButton color={'tertiary'}>Validate</IonButton>
                    : <p>Validated</p>}
                </IonItem>
            </IonCard>
    );
};

export default TaskInfo;