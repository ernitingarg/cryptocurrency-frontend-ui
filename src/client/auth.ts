import auth from 'src/lib/firebase/auth';

export class AuthClient {
  private static instance: AuthClient;
  private constructor() {}
  currentUser = () => {
    const currentUser = auth.currentUser;
    return currentUser;
  };

  getIdToken = async () => {
    const currentUser = this.currentUser();
    if (!currentUser) return null;
    const idToken = await currentUser.getIdToken();
    return idToken;
  };

  static create = () => {
    if (AuthClient.instance) return AuthClient.instance;
    AuthClient.instance = new AuthClient();
    return AuthClient.instance;
  };

  onAuthStateChanged: firebase.auth.Auth['onAuthStateChanged'] = (next, err, comp) =>
    auth.onAuthStateChanged(next, err, comp);
  createUserWithEmailAndPassword: firebase.auth.Auth['createUserWithEmailAndPassword'] = (email, string) =>
    auth.createUserWithEmailAndPassword(email, string);
  signInWithEmailAndPassword: firebase.auth.Auth['signInWithEmailAndPassword'] = (email, string) =>
    auth.signInWithEmailAndPassword(email, string);
  signOut: firebase.auth.Auth['signOut'] = () => auth.signOut();
}

const authClient = AuthClient.create();
export default authClient;
