import { IonAccordion, IonAccordionGroup, IonBackButton, IonButton, IonButtons, IonCardContent, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonLoading, IonModal, IonNote, IonPage, IonProgressBar, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonTitle, IonToggle, IonToolbar, SearchbarInputEventDetail, useIonViewWillEnter } from '@ionic/react';
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

    const redeem = async (id: number) => {
        setLoading(true);
        
        try {
            console.log('Senging recuest');
            var api = new RewardApi(apiConf);
            var response = await api.redeemReward(id);
            console.log(response.data);
            
            handleListChange(id, 'redeem');
            
        } catch (error: any) {
            console.log("Key:" +apiConf!.accessToken);

            switch (error.response?.status) {
                case 404:
                    navigate.push("/group");
                    console.log('No group found');
                    break;
                case 401:
                    navigate.push("/login");
                    break;
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
            handleListChange(id, 'validate');

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

            handleListChange(id, 'remove');
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

    const handleListChange = (id: number, action: string) => {
        switch (action) {
            case 'redeem':
                setSearchRewardList(rewardList!.map(reward => {
                    if (reward.id === id) {
                        reward.redeem = true;
                        return reward;
                    } else {
                        return reward;
                    }
                }));
                break;
            case 'validate':
                setSearchRewardList(rewardList!.map(reward => {
                    if (reward.id === id) {
                        reward.validate = true;
                        return reward;
                    } else {
                        return reward;
                    }
                }));
                break;
            case 'remove':
                setSearchRewardList(rewardList!.filter((reward) => reward.id! !== id));
                break;
        }  
    };

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
                <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
                <IonSearchbar debounce={1000} onIonInput={(ev) => handleInput(ev)}></IonSearchbar>
                {rewardSearchList?.map((reward) => {
                    return (
                        <IonAccordionGroup expand="inset" key={reward.id}>
                            <IonAccordion>
                                <IonItem slot="header" color="">
                                    <IonLabel>
                                        <div className="ion-padding-bottom">
                                            <h3>{reward.title}</h3>
                                            <small>Cost: {reward.cost} </small><br/>
                                            <small>Expire: {reward.expire_at}</small>
                                        </div>
                                        <IonProgressBar value={5172/(reward.cost && reward.cost != 0 ? reward.cost : 1)}></IonProgressBar>
                                    </IonLabel>
                                </IonItem>
                                <div slot="content">
                                    <RewardInfo reward={reward} remove={remove} redeem={redeem} validate={validate}/>
                                </div>
                            </IonAccordion>
                        </IonAccordionGroup>
                    );
                })}
            </IonContent>
        </IonPage>
    );
};

export default RewardList;