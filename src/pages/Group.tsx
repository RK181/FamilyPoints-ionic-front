import { IonAlert, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonLoading, IonMenuButton, IonPage, IonTitle, IonToolbar, IonicSafeString, setupIonicReact, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import GroupCreateForm from '../components/GroupCreateForm';
import GroupInfo from '../components/GroupInfo';

import { AuthApi, Group as GroupInterface, GroupApi } from '../api';
import { useHistory } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { informationCircleOutline } from 'ionicons/icons';


const Group: React.FC = () => {
    const navigate = useHistory();
    const {apiConf, setSession} = useApp();
    const [group, setGroup] = useState<GroupInterface>();
    const [loading, setLoading] = useState<boolean>(true);
    const [groupExist, setGroupExist] = useState<boolean | null>(null);
    // Alert
    const [showInformation, setShowInformation] = useState(false);
    
    setupIonicReact({
        // For nested html in alert message
        innerHTMLTemplatesEnabled : true,
    });

    useIonViewWillEnter(() => {
        load();
    });
    
    const load = async () => {
        setLoading(true);
        
        try {
            var api = new GroupApi(apiConf);
            var response = await api.getGroup();

            setGroup(response.data)
            setGroupExist(true);
        } catch (error: any) {
            if (error.response?.status == 404) {
                setGroupExist(false);
            }
            else if (error.response?.status == 401) {
                setSession!(false, '', '');
                navigate.push("/login");
            }
        }finally {
            setLoading(false);
        }
    }

    return (
        <IonPage>
            <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start"><IonMenuButton /></IonButtons>
                    <IonTitle>
                        {groupExist == null ? ''
                        :
                        groupExist === true ?
                            "Group Info"
                            :
                            "Create Group"
                        }
                    </IonTitle>
                    <IonButton slot="end" color={'dark'} fill="clear" onClick={() => setShowInformation(true)}>
                        <IonIcon icon={informationCircleOutline}></IonIcon>
                    </IonButton>
                    <IonAlert
                        mode='md'
                        isOpen={showInformation}
                        onDidDismiss={() => setShowInformation(false)}
                        header="Info. Create Group"
                        message={new IonicSafeString(`
                        <p><b>Group Name</b>: The name of the group.</p>
                        <p><b>Points</b>: Can be earned and used to redeem rewards.</p>
                        <ul>
                            <li><small><b>Points Name</b>: The name of the points.</small></li>
                            <li><small><b>Points Icon</b>: The icon of the points.</small></li>
                        </ul>
                        <p><small>*Points can have a negative value.</small></p>
                        <p><b>Settings</b></p>
                        <ul>
                            <li><small><b>Require Task Approval</b>: If the tasks require approval of the couple.</small></li>
                            <li><small><b>Require Task Validation</b>: If the tasks require validation of the couple to receive points after completing the task.</small></li>
                            <li><small><b>Permite Task Invalidation</b>: If the tasks can be invalidated by the couple.</small></li>
                            <li><small><b>Require Reward Validation</b>: If the rewards require validation of the couple to be redeemed.</small></li>
                        </ul>
                        `)}
                        buttons={["Close"]}
                    />
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {groupExist == null ? ''
                :
                groupExist === true ?
                    <GroupInfo group={group as any} />
                    :
                    <GroupCreateForm reload={load} />
                }
            </IonContent>
        </IonPage>
    );
};

export default Group;