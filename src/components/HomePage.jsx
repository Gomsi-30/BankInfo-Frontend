import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import '../styles/bankform.css';
import toast , {Toaster} from 'react-hot-toast'; 
import { useNavigate } from 'react-router-dom';

const bankAccountSchema = z.object({
  ifscCode: z.string().min(11, { message: 'IFSC Code must be 11 characters long' }),
  branchName: z.string().min(1, { message: 'Branch Name is required' }),
  bankName: z.string().min(1, { message: 'Bank Name is required' }),
  accountNumber: z.string().min(9, { message: 'Account Number must be at least 9 digits long' }),
  accountHolderName: z.string().min(1, { message: 'Account Holder Name is required' }),
});

const HomePage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(bankAccountSchema),
  });

  const onSubmit = async (data) => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
      toast.error('You must be logged in to add bank account details.');
      return;
    }
    
    try {
      const response = await fetch('https://bank-info-backend.vercel.app/api/createbank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add bank account details');
      }
  
      const result = await response.json();
      console.log('Bank Account Details:', result);
      toast.success('Bank Account Details added successfully');
      navigate('/allbanks');
      
    } catch (e) {
      console.log(e.message);
      toast.error(e.message);
    }
    
    reset();
  };
  

  return (
    <div className="bank-account-container">
      <h2>Add Bank Account Details</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="bank-account-form">
        <div className="form-group">
          <label htmlFor="ifscCode">IFSC Code</label>
          <input
            type="text"
            id="ifscCode"
            {...register('ifscCode')}
            className={`input-field ${errors.ifscCode ? 'input-error' : ''}`}
          />
          {errors.ifscCode && <span className="error-message">{errors.ifscCode.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="branchName">Branch Name</label>
          <input
            type="text"
            id="branchName"
            {...register('branchName')}
            className={`input-field ${errors.branchName ? 'input-error' : ''}`}
          />
          {errors.branchName && <span className="error-message">{errors.branchName.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="bankName">Bank Name</label>
          <input
            type="text"
            id="bankName"
            {...register('bankName')}
            className={`input-field ${errors.bankName ? 'input-error' : ''}`}
          />
          {errors.bankName && <span className="error-message">{errors.bankName.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="accountNumber">Account Number</label>
          <input
            type="text"
            id="accountNumber"
            {...register('accountNumber')}
            className={`input-field ${errors.accountNumber ? 'input-error' : ''}`}
          />
          {errors.accountNumber && <span className="error-message">{errors.accountNumber.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="accountHolderName">Account Holder Name</label>
          <input
            type="text"
            id="accountHolderName"
            {...register('accountHolderName')}
            className={`input-field ${errors.accountHolderName ? 'input-error' : ''}`}
          />
          {errors.accountHolderName && <span className="error-message">{errors.accountHolderName.message}</span>}
        </div>

        <button type="submit" className="submit-button">Add Account</button>
      </form>
      <Toaster />
    </div>
  );
};

export default HomePage;
