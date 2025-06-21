import React, { useContext } from 'react';
import Button from '../../components/button';
import AuthContext from '../../context/AuthProvider';

const UserPage = () => {
  const { auth } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-black flex items-center justify-center">
      <div className="bg-gray-200 w-[550px] h-[600px] flex flex-col items-center justify-center border rounded-3xl gap-[30px]">
        <div className="flex flex-col text-center">
          <span className="font-medium text-[24px] text-gray-600">
            Welcome back,
          </span>
          <span className="text-gray-900 font-bold text-[40px]">
            {auth.name}
          </span>
        </div>
        <Button
          name="Trening"
          className="text-gray-200 w-[236px] h-[80px] text-[20px]"
        />
      </div>
    </div>
  );
};

export default UserPage;
