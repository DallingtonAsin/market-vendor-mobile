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
    setProfile: (user) => {
      
    },
});

export const ProfileProvider = ProfileContext.Provider;

export default ProfileContext