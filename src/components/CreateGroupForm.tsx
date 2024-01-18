import { IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCol, IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonLoading, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToggle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { AuthApi, ValidationErrorResponse } from '../api';
import { useApi } from '../context/ApiContext';
import { logoIonic } from 'ionicons/icons';


const CreateGroupForm: React.FC = () => {
    const {isAuthenticated, apiConf, setSession} = useApi();
    // Loading Animation
    const [loading, setLoading] = useState<boolean>(false);
    // Form variabels
    const [name, setName] = useState<string>('');
    const [pointsName, setPointsName] = useState<string>('');
    const [pointsIcon, setPointsIcon] = useState<string>('');
    const [requireTaskApprove, setReqTApprove] = useState<boolean>(true);
    const [requireTaskValidation, setReqTValidation] = useState<boolean>(true);
    const [permiteTaskInValidation, setPerTInValidation] = useState<boolean>(true);
    const [requireRewardValidation, setReqRValidation] = useState<boolean>(true);

    const [formErrors, setFormErrors] = useState<ValidationErrorResponse>();


    const submit = async (event: any) => {
        event.preventDefault();
        setLoading(true);

        try {
            var api = new AuthApi(apiConf);
            

        } catch (error: any) {
            if (error.response?.status == 400) {
                var err = error.response.data as ValidationErrorResponse;
                setFormErrors(err);
            }
            
            /*setFormErrors( (error.response &&
                error.response.data &&
                error.response.data.errors.email[0]) ||
              error.message ||
              error.toString());*/
            
        } finally {
            setLoading(false);
        }
    }

    const test =async (e:any) => {
        console.log(e)
    }
    
    return (
        <IonRow class="ion-justify-content-center">
            <IonCol size="auto">
            <IonLoading className="custom-loading" isOpen={loading} message="Loading" spinner="circles" />
            <div>Auth: {isAuthenticated ? 'true':'false'}</div>
            <form onSubmit={submit} >
                <IonInput
                    mode="md"
                    type="text"
                    fill="outline"
                    label="Group Name"
                    labelPlacement="floating"
                    onIonChange={(e) => setName(e.detail.value!)}
                    //placeholder=""
                    required
                ></IonInput>

                <IonItemGroup className="ion-margin-top">
                    <IonItemDivider color="light">
                        <IonLabel>Points</IonLabel>
                    </IonItemDivider>
                    <IonItem>
                        <IonInput
                            mode="md"
                            type="text"
                            label="Points Name:"
                            //labelPlacement="floating"
                            onIonChange={(e) => setPointsName(e.detail.value!)}
                            placeholder="..."
                            required
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonSelect label="Icon" placeholder="select icon" onIonChange={(e) => setPointsIcon(e.detail.value!)}>
                            <IonSelectOption value="1">icon 1</IonSelectOption>
                            <IonSelectOption value="2">icon 2</IonSelectOption>
                            <IonSelectOption value="3">icon 3</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItemDivider color="light" className="ion-margin-top">
                        <IonLabel>Settings</IonLabel>
                    </IonItemDivider>
                    <IonItem>
                        <IonToggle checked={requireTaskApprove} enableOnOffLabels={true} onIonChange={(e) => setReqTApprove(e.detail.checked!)}>Require Task Approve</IonToggle>
                    </IonItem>
                    <IonItem>
                        <IonToggle checked={requireTaskValidation} enableOnOffLabels={true} onIonChange={(e) => setReqTValidation(e.detail.checked!)}>Require Task Validation</IonToggle>
                    </IonItem>
                    <IonItem>
                        <IonToggle checked={permiteTaskInValidation} enableOnOffLabels={true} onIonChange={(e) => setPerTInValidation(e.detail.checked!)}>Permite Task Invalidation</IonToggle>
                    </IonItem>
                    <IonItem>
                        <IonToggle checked={requireRewardValidation} enableOnOffLabels={true} onIonChange={(e) => setReqRValidation(e.detail.checked!)}>Require Reward Validation</IonToggle>
                    </IonItem>
                </IonItemGroup>

                <IonButton type='submit' expand="block" color='success' className="ion-margin-top" >
                    Create Group
                </IonButton>
            </form>
            </IonCol>
        </IonRow>
    );
};

export default CreateGroupForm;