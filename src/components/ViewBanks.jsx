import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/banktable.css';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

const BankAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingAccount, setEditingAccount] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await axios.get('https://bank-info-backend.vercel.app/api/viewbanks', { withCredentials: true });
                setAccounts(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const handleEditClick = (account) => {
        setEditingAccount(account);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3001/api/updatebank/${editingAccount._id}`, editingAccount,{withCredentials: true});
            setAccounts(accounts.map((acc) => (acc._id === editingAccount._id ? response.data : acc)));
            setEditingAccount(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteClick = (accountId) => {
        setSelectedAccountId(accountId);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            console.log('fn called')
            await axios.delete(`http://localhost:3001/api/deletebank/${selectedAccountId}`,{withCredentials: true});
            setAccounts(accounts.filter((acc) => acc._id !== selectedAccountId));
            setShowDeleteConfirm(false);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1 className="header">Bank Account Details</h1>
            <div className="grid-container">
                {accounts.map((account) => (
                    <div key={account._id} className="bank-card">
                        <div className="bank-header">
                            <h3>{account.bankName}</h3>
                            <span className="bank-badge">Bank</span>
                        </div>
                        <div className="bank-details">
                            <p>
                                <strong>A/C No.</strong> {String(account.accountNumber).replace(/\d{10}(?=\d{4})/, "******")}
                            </p>
                            <p>
                                <strong>IFSC:</strong> {account.ifscCode.replace(/.{6}(?=\d{4})/, "******")}
                            </p>
                            <p>{account.accountHolderName}</p>
                        </div>
                        <div className="bank-actions">
                            <button onClick={() => handleEditClick(account)}>
                                <FaPencilAlt color='red'/>
                            </button>
                            <button onClick={() => handleDeleteClick(account._id)}>
                                <FaTrashAlt color='red'/> 
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingAccount && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Bank Account</h2>
                        <form onSubmit={handleEditSubmit}>
                            <label>
                                Bank Name:
                                <input
                                    type="text"
                                    value={editingAccount.bankName}
                                    onChange={(e) => setEditingAccount({ ...editingAccount, bankName: e.target.value })}
                                />
                            </label>
                            <label>
                                Account Number:
                                <input
                                    type="text"
                                    value={editingAccount.accountNumber}
                                    onChange={(e) => setEditingAccount({ ...editingAccount, accountNumber: e.target.value })}
                                />
                            </label>
                            <label>
                                IFSC Code:
                                <input
                                    type="text"
                                    value={editingAccount.ifscCode}
                                    onChange={(e) => setEditingAccount({ ...editingAccount, ifscCode: e.target.value })}
                                />
                            </label>
                            <label>
                                Account Holder Name:
                                <input
                                    type="text"
                                    value={editingAccount.accountHolderName}
                                    onChange={(e) => setEditingAccount({ ...editingAccount, accountHolderName: e.target.value })}
                                />
                            </label>
                            <div className="modal-actions">
                                <button type="submit" style={{ backgroundColor: 'green' }}>Save Changes</button>
                                <button type="button" style={{ backgroundColor: 'red' }} onClick={() => setEditingAccount(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this bank account?</p>
                        <div className="modal-actions">
                            <button className='bt' onClick={handleDeleteConfirm}>Confirm</button>
                            <button className='bt2' onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankAccounts;
