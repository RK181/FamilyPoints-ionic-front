import { IonBackButton, IonButton, IonButtons, IonCardContent, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonLoading, IonModal, IonNote, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToggle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { GroupApi, Group, User, ValidationErrorResponse, Reward, RewardApi } from '../api';
import { useApp } from '../context/AppContext';
import { format, parseISO, subDays } from 'date-fns';
import { paw } from 'ionicons/icons';

const RewardList: React.FC = () => {
    const navigate = useHistory();
    const {apiConf, isAuthenticated} = useApp();
    const [rewardList, setRewardList] = useState<Reward[]>();
    const [loading, setLoading] = useState<boolean>(true);
    
    useIonViewWillEnter(() => {
        load();
        console.log('Group reward list ionViewDidEnter event fired');
    });
    
    const load = async () => {
        setLoading(true);
        
        try {
            console.log('Senging recuest');
            
            var api = new RewardApi(apiConf);
            
            var response = await api.getGroupRewardList();

            setRewardList(response.data)
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

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton></IonBackButton>
                    </IonButtons>
                    <IonTitle>Reward List</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCardContent>
                    <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
                    
                    {rewardList?.map((reward) => {
                        return (
                            <IonItem button routerDirection="none" lines="inset" detail={true}>
                                <IonIcon aria-hidden="true" slot="start" icon={paw} />
                                <IonLabel>
                                    <h3>{reward.title}</h3>
                                    <p>{reward.user?.name}</p>
                                    <p>Reward: {reward.cost}</p>
                                    
                                </IonLabel>
                                <IonNote slot='end' ><p>Expire: {reward.expire_at}</p></IonNote>
                            </IonItem>
                            
                        );
                    })}

                    
                </IonCardContent>
            </IonContent>
        </IonPage>
    );
};

export default RewardList;