import { IonButtons, IonContent, IonFooter, IonHeader, IonLoading, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import GroupCreateForm from '../components/GroupCreateForm';
import GroupInfo from '../components/GroupInfo';

import { AuthApi, Group as GroupInterface, GroupApi } from '../api';
import { useHistory } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Group: React.FC = () => {
    const navigate = useHistory();
    const {apiConf} = useApp();
    const [group, setGroup] = useState<GroupInterface>();
    const [loading, setLoading] = useState<boolean>(true);
    const [groupExist, setGroupExist] = useState<boolean | null>(null);
    
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