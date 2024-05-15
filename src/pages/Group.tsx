import { IonButtons, IonContent, IonFooter, IonHeader, IonLoading, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import GroupCreateForm from '../components/GroupCreateForm';
import GroupInfo from '../components/GroupInfo';

import { AuthApi, Group as GroupInterface, GroupApi } from '../api';
import { useHistory } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Group: React.FC = () => {
    const navigate = useHistory();
    const {apiConf, isAuthenticated} = useApp();
    const [group, setGroup] = useState<GroupInterface>();
    const [loading, setLoading] = useState<boolean>(true);
    const [groupExist, setGroupExist] = useState<boolean | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);
    
    useIonViewWillEnter(() => {
        load();
    });
    
    const load = async () => {
        setLoading(true);
        
        try {
            console.log('Senging recuest');
            var api = new GroupApi(apiConf);
            
            var response = await api.getGroup();

            setGroup(response.data)
            setGroupExist(true);
            console.log(response);

        } catch (error: any) {
            console.log("Key:" +apiConf!.accessToken);

            if (error.response?.status == 404) {
                setGroupExist(false);
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
            <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
            <IonHeader>
                <IonToolbar>
                <IonButtons slot="start"><IonMenuButton /></IonButtons>
                    <IonTitle>
                        {groupExist == null ? ''
                        :
                        groupExist === true || refresh?
                            "Group Info"
                            :
                            "Create Group"
                        }
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {groupExist == null ? ''
                :
                groupExist === true || refresh?
                    <GroupInfo group={group as any} />
                    :
                    <GroupCreateForm reload={load} />
                }
            </IonContent>
        </IonPage>
    );
};

export default Group;