import { IonButtons, IonContent, IonFooter, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import CreateGroupForm from '../components/CreateGroupForm';

const Group: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonButtons slot="start"><IonMenuButton /></IonButtons>

                    <IonTitle>Page Title</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <CreateGroupForm />
            </IonContent>
        </IonPage>
    );
};

export default Group;