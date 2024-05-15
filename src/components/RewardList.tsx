import { IonAccordion, IonAccordionGroup, IonBackButton, IonButton, IonButtons, IonCardContent, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonModal, IonNote, IonPage, IonProgressBar, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonTitle, IonToast, IonToggle, IonToolbar, SearchbarInputEventDetail, useIonViewWillEnter } from '@ionic/react';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { Reward, RewardApi, Group, GroupApi, User } from '../api';
import { useApp } from '../context/AppContext';
import RewardInfo from './RewardInfo';
import { filterSharp } from 'ionicons/icons';
import { getIcon } from '../constants/constants';
import './List.css';

const RewardList: React.FC = () => {
    const navigate = useHistory();
    const {apiConf, authEmail, setSession} = useApp();
    const [rewardList, setRewardList] = useState<Reward[]>();
    const [rewardSearchList, setSearchRewardList] = useState<Reward[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [group, setGroup] = useState<Group>();
    const [currentUser, setCurrentUser] = useState<User>();
    const modal = useRef<HTMLIonModalElement>(null);
    // Toast
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastColor, setToastColor] = useState<string>('success');

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
            var api = new GroupApi(apiConf);
            var response = await api.getGroup();
            setGroup(response.data);
            // Current user is the creator of the group or the couple
            var user = response.data.creator?.email == authEmail ? response.data.creator : response.data.couple;
            setCurrentUser(user)
            
            var apiR = new RewardApi(apiConf);           
            var responseR = await apiR.getGroupRewardList();
            setRewardList(responseR.data);
            setSearchRewardList(responseR.data);
            
        } catch (error: any) {
            errorhandler(error);
        }finally {
            setLoading(false);
        }
    }

    const redeem = async (id: number) => {
        setLoading(true);
        
        try {
            var api = new RewardApi(apiConf);
            var response = await api.redeemReward(id);
            setToastOpen(true);
            setToastMessage(response.data.message!);
            setToastColor('success');
            handleListChange(id, 'redeem');
            
        } catch (error: any) {
            errorhandler(error);
        }finally {
            setLoading(false);
        }
    }

    const validate = async (id: number) => {
        setLoading(true);
        
        try {
            var api = new RewardApi(apiConf);
            var response = await api.validateReward(id);
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

    const remove = async (id: number) => {
        setLoading(true);
        
        try {
            var api = new RewardApi(apiConf);
            var response = await api.deleteRewardById(id);
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
            case 'redeem':
                setSearchRewardList(rewardList!.map(reward => {
                    if (reward.id === id) {
                        if (group?.conf_r_valiadte === false){
                            reward.validate = true;
                        }
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

    const filterList = (filter: string) => {
        switch (filter) {
            case 'waitRedeem':
                setSearchRewardList(rewardList!.filter((reward) => reward.redeem == false));
                break;
            case 'waitValidate':
                setSearchRewardList(rewardList!.filter((reward) => (reward.redeem == true && reward.validate == false)));
                break;
            case 'redeemedAndValidated':
                setSearchRewardList(rewardList!.filter((reward) => (reward.redeem == true && reward.validate == true)));
                break;
            case 'myRewards':
                setSearchRewardList(rewardList!.filter((reward) => reward.user?.email == authEmail));
                break;
            case 'coupleRewards':
                setSearchRewardList(rewardList!.filter((reward) => reward.user?.email != authEmail));
                break;
            case 'all':
                setSearchRewardList(rewardList);
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
                    <IonTitle>Reward List</IonTitle>
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
                                <IonItem button detail={false} onClick={() => {filterList('myRewards'), modal.current?.dismiss(); }}>
                                    <IonLabel>My rewards</IonLabel>
                                </IonItem>
                                <IonItem button detail={false} onClick={() => {filterList('coupleRewards'), modal.current?.dismiss(); }}>
                                    <IonLabel>Couple rewards</IonLabel>
                                </IonItem>
                                <IonItem button detail={false} onClick={() => {filterList('waitRedeem'), modal.current?.dismiss(); }}>
                                    <IonLabel>Waiting to redeem</IonLabel>
                                </IonItem>
                                <IonItem button detail={false} onClick={() => {filterList('waitValidate'), modal.current?.dismiss(); }}>
                                    <IonLabel>Waiting to validate</IonLabel>
                                </IonItem>
                                <IonItem button detail={false} onClick={() => {filterList('redeemedAndValidated'), modal.current?.dismiss(); }}>
                                    <IonLabel>Redeemed and validated</IonLabel>
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
                <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
                {rewardSearchList?.map((reward) => {
                    return (
                        <IonAccordionGroup expand="inset" key={reward.id}>
                            <IonAccordion>
                                <IonItem slot="header" color={reward.user?.email == authEmail ? "secondary" : "light"}>
                                    <IonLabel>
                                        <div className="ion-padding-bottom">
                                            <h3>{reward.title}</h3>
                                            <small>Cost: {reward.cost} <IonIcon src={getIcon(group?.points_icon!)}></IonIcon></small><br/>
                                            <small>Expire: {reward.expire_at}</small>
                                        </div>
                                        {currentUser?.email == reward.user?.email ?
                                            <IonProgressBar 
                                                value={currentUser?.points!/(reward.cost && reward.cost != 0 ? reward.cost : 1)}
                                                color={'danger'}
                                            ></IonProgressBar>
                                        : ''}
                                    </IonLabel>
                                </IonItem>
                                <div slot="content">
                                    <RewardInfo group={group!} reward={reward} remove={remove} redeem={redeem} validate={validate}/>
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

export default RewardList;