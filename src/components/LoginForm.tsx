import { IonButton, IonCardContent, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState(null);
    const [ formErrors, setFormErrors ] = useState<any>();

    function login(params:any) {
    }
    
    const submit = async (event: any) => {
        event.preventDefault();

        try {
        /*await login({
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
                <IonInput name="email" mode="md" fill="outline" labelPlacement="floating" label="Email" type="email" placeholder="example@email.com"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                ></IonInput>
                <IonInput name="password" mode="md" className="ion-margin-top" fill="outline" labelPlacement="floating" label="Password" type="password" placeholder="password"
                value={password} 
                onIonChange={(e) => setPassword(e.detail.value!)}
                ></IonInput>

                <div>
                    {formErrors ? (
                    formErrors
                    ): null}
                </div>
            
                
                <IonButton type='submit' expand="block" className="ion-margin-top" >
                    Login
                </IonButton>


                <IonButton routerLink="/signup" color={'secondary'} type="button" expand="block" className="ion-margin-top">
                    Create account
                </IonButton>
            </form>
        </IonCardContent>
    );
};

export default LoginForm;
