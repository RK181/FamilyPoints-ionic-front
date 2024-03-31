import { IonAccordion, IonAccordionGroup, IonBackButton, IonButton, IonButtons, IonCardContent, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonLoading, IonModal, IonNote, IonPage, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonTitle, IonToggle, IonToolbar, SearchbarInputEventDetail, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { ValidationErrorResponse, Reward, RewardApi } from '../api';
import { useApp } from '../context/AppContext';
import RewardInfo from './RewardInfo';

const RewardList: React.FC = () => {
    const navigate = useHistory();
    const {apiConf} = useApp();
    const [rewardList, setRewardList] = useState<Reward[]>();
    const [rewardSearchList, setSearchRewardList] = useState<Reward[]>();
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

            setRewardList(response.data);
            setSearchRewardList(response.data);
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

    const handleInput = (ev: Event) => {
        let query = '';
        const target = ev.target as HTMLIonSearchbarElement;
        if (target) query = target.value!.toLowerCase();
    
        setSearchRewardList(rewardList!.filter((reward) => reward.title!.toLowerCase().indexOf(query) > -1));
      };

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
                    <IonSearchbar debounce={1000} onIonInput={(ev) => handleInput(ev)}></IonSearchbar>
                    {rewardSearchList?.map((reward) => {
                        return (
                            <IonAccordionGroup expand="inset">
                                <IonAccordion value={''+reward.id} >
                                    <IonItem slot="header" color="primary" key={reward.id}>
                                        <IonLabel>
                                        <h3>{reward.title}</h3>
                                        <small>Cost: {reward.cost}</small> <br/>
                                        <small font-size="2">Expire: {reward.expire_at}</small>
                                        </IonLabel>
                                    </IonItem>
                                    <div slot="content">
                                        <RewardInfo reward={reward} />
                                    </div>
                                </IonAccordion>
                            </IonAccordionGroup>
                        );
                    })}
                </IonCardContent>
            </IonContent>
        </IonPage>
    );
};

export default RewardList;