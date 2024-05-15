import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import {useApp } from './context/AppContext';
import Group from './pages/Group';
import Menu from './components/Menu';
import GroupAddUserForm from './components/GroupAddUserForm';
import RewardCreateForm from './components/RewardCreateForm';
import TaskCreateForm from './components/TaskCreateForm';
import Rewards from './pages/Rewards';
import Tasks from './pages/Tesks';
import GroupUpdateForm from './components/GroupUpdateForm';


setupIonicReact();

const App: React.FC = () => {
  const {isAuthenticated} = useApp();

  return (
    <IonApp>
        <IonReactRouter>
          <Menu />
          <IonRouterOutlet id="main">

            <Route exact path="/signup">
              <SignUp />
            </Route>

            <Route exact path="/" render={() => {
              return isAuthenticated ? <Group /> : <Login />;
            }} />
            
            <Route exact path="/login" render={() => {
              return isAuthenticated ? <Group /> : <Login />;
            }} />
            
            <Route exact path="/group" render={() => {
              return isAuthenticated ? <Group /> : <Login />;
            }} />

            <Route exact path="/groupUpdateForm" render={() => {
              return isAuthenticated ? <GroupUpdateForm /> : <Login />;
            }} />

            <Route exact path="/groupAddUser" render={() => {
              return isAuthenticated ? <GroupAddUserForm /> : <Login />;
            }} />

            <Route exact path="/rewardForm" render={() => {
              return isAuthenticated ? <RewardCreateForm /> : <Login />;
            }} />

            <Route exact path="/rewards" render={() => {
              return isAuthenticated ? <Rewards /> : <Login />;
            }} />

            <Route exact path="/taskForm" render={() => {
              return isAuthenticated ? <TaskCreateForm /> : <Login />;
            }} />

            <Route exact path="/tasks" render={() => {
              return isAuthenticated ? <Tasks /> : <Login />;
            }} />

          </IonRouterOutlet>
        </IonReactRouter>
    </IonApp>
  );
};

export default App;
