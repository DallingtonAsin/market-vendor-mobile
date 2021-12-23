import React from 'react';

const ProfileContext = React.createContext({
    profile: {
        user_id: '',
        name: '',
        firstname: '',
        lastname: '',
        phoneNo: '',
        email: '',
        account_balance: '',
        image: '',
      },
    setProfile: () => {},
});

export const ProfileProvider = ProfileContext.Provider;

export default ProfileContext