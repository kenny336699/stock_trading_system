// components/UserProfile.tsx

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchUserStocks } from "@/store/stockSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const userStocks = useSelector((state: RootState) => state.stock.userStocks);
  const loading = useSelector((state: RootState) => state.stock.loading);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUserStocks(currentUser.id));
    }
  }, [currentUser, dispatch]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="container space-y-6 mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-lg font-medium">{currentUser.username}</p>
                <p className="text-sm text-muted-foreground">
                  Balance: ${currentUser.balance}
                </p>
              </div>
            </div>
          ) : (
            <p>User information not available</p>
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Stock Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {userStocks && userStocks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Avg. Buy Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userStocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">
                      {stock.symbol}
                    </TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>${stock.average_buy_price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground">
              You don't have any stocks yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-[200px]" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-[200px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  </div>
);

export default UserProfile;
