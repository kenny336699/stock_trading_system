// components/AdminDashboard.tsx
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "../store";
import { fetchAllUsers, updateUserStatus, User } from "@/store/adminSlice";

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading } = useAppSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleStatusChange = (userId: number, newStatus: string) => {
    dispatch(updateUserStatus({ userId, status: newStatus }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Username</th>
                <th className="py-2 px-4 border-b text-left">
                  Failed Login Attempts
                </th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{user.id}</td>
                  <td className="py-2 px-4 border-b">{user.username}</td>
                  <td className="py-2 px-4 border-b">
                    {user.failedLoginAttempts}
                  </td>
                  <td className="py-2 px-4 border-b">{user.account_status}</td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={user.account_status}
                      onChange={(e) =>
                        handleStatusChange(user.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
