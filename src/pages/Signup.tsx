import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import SignupForm from '../components/SignupForm';

const SignUp: React.FC = () => {

    return (
        
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonButtons slot="start"><IonMenuButton /></IonButtons>
                    <IonTitle>Sign-up</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" scrollY={false}>
                <SignupForm />
            </IonContent>
        </IonPage>
    );
};

export default SignUp;