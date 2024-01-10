import { IonButton, IonCardContent, IonContent, IonHeader, IonInput, IonItem, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';

const LoginForm: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState(null);
    const [ formErrors, setFormErrors ] = useState<any>();

    function login(params:any) {
    }
    
    const submit = async (event: any) => {
        event.preventDefault();
        setFormErrors(password);

        try {
        /*await signup({
            name,
            email,
            password
        });*/
        } catch (e) {
            setFormErrors(e);
        }
    }

    return (
        <IonCardContent>
            <form onSubmit={submit} >
                <IonInput name="name" mode="md" fill="outline" labelPlacement="floating" label="Name" type="text" placeholder="name"
                value={name}
                onIonChange={(e) => setName(e.detail.value!)}
                ></IonInput>
                <IonInput name="email" mode="md" className="ion-margin-top" fill="outline" labelPlacement="floating" label="Email" type="email" placeholder="example@email.com"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                ></IonInput>
                <IonInput name="password" mode="md" className="ion-margin-top" fill="outline" labelPlacement="floating" label="Password" type="password" placeholder="password"
                value={password} 
                onIonChange={(e) => setPassword(e.detail.value!)}
                ></IonInput>

                <IonItem color="danger">
                <p className="Error" color="danger">
                    werewer
                        {formErrors ? (
                        formErrors
                        ): null}
                    </p>
                </IonItem>
                <IonText color="danger" className="ion-padding-start">
                    <small>ass</small>
                </IonText>
                
                
            
                
                <IonButton type='submit' expand="block" className="ion-margin-top" >
                    Create account
                </IonButton>


                <IonButton routerLink="/" color={'secondary'} type="button" expand="block" className="ion-margin-top">
                    Login
                </IonButton>
            </form>
        </IonCardContent>
    );
};

export default LoginForm;
