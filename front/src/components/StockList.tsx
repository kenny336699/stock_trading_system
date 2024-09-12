import React, { useEffect, useState } from "react";
import { RootState } from "../store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAllStocks,
  fetchStockBySymbol,
  buyStock,
  sellStock,
  fetchUserStocks,
} from "@/store/stockSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const StockList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stocks, userStocks, loading, error } = useAppSelector(
    (state: RootState) => state.stock
  );
  const { currentUser } = useAppSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    dispatch(fetchAllStocks());
    if (currentUser) {
      dispatch(fetchUserStocks(currentUser.id));
    }
  }, [dispatch, currentUser]);

  const handleSearch = () => {
    if (searchTerm) {
      dispatch(fetchStockBySymbol(searchTerm));
    } else {
      dispatch(fetchAllStocks());
    }
  };

  const handleBuyClick = (stock: any) => {
    if (!currentUser) {
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 5000);
    } else {
      setSelectedStock(stock);
      setQuantity(1);
      setBuyModalOpen(true);
    }
  };

  const handleSellClick = (stock: any) => {
    if (!currentUser) {
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 5000);
    } else {
      setSelectedStock(stock);
      const userStockQuantity = getUserStockQuantity(stock.id);
      setQuantity(userStockQuantity > 0 ? 1 : 0);
      setSellModalOpen(true);
    }
  };

  const handleBuyConfirm = () => {
    if (selectedStock && currentUser) {
      dispatch(
        buyStock({
          userId: currentUser.id,
          stockId: selectedStock.id,
          quantity: quantity,
        })
      );
      setBuyModalOpen(false);
      setQuantity(1);
    }
  };

  const handleSellConfirm = () => {
    if (selectedStock && currentUser) {
      dispatch(
        sellStock({
          userId: currentUser.id,
          stockId: selectedStock.id,
          quantity: quantity,
        })
      );
      setSellModalOpen(false);
      setQuantity(1);
    }
  };

  const getUserStockQuantity = (stockId: number) => {
    if (!userStocks) return 0; // Add this line

    const userStock = userStocks.find((stock) => stock.stock_id === stockId);
    console.log("userStock", userStocks, stockId);
    return userStock ? userStock.quantity : 0;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Market Dashboard</h1>

      {showLoginAlert && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in to buy or sell stocks.
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Stock List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && Array.isArray(stocks) && stocks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Your Quantity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock) => {
                  const userQuantity = getUserStockQuantity(stock.id);
                  console.log(userQuantity);
                  return (
                    <TableRow key={stock.id}>
                      <TableCell>{stock.symbol}</TableCell>
                      <TableCell>{stock.name}</TableCell>
                      <TableCell>${stock.current_price}</TableCell>
                      <TableCell>{userQuantity}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleBuyClick(stock)}
                          className="mr-2"
                        >
                          Buy
                        </Button>
                        <Button
                          onClick={() => handleSellClick(stock)}
                          variant="outline"
                          disabled={userQuantity === 0}
                        >
                          Sell
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p>No stocks available.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={buyModalOpen} onOpenChange={setBuyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy Stock</DialogTitle>
            <DialogDescription>
              {selectedStock && (
                <>
                  You are about to buy {selectedStock.name} (
                  {selectedStock.symbol}) stock. Current price: $
                  {selectedStock.current_price}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value)))
              }
              min="1"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBuyModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBuyConfirm}>Confirm Purchase</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sellModalOpen} onOpenChange={setSellModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sell Stock</DialogTitle>
            <DialogDescription>
              {selectedStock && (
                <>
                  You are about to sell {selectedStock.name} (
                  {selectedStock.symbol}) stock. Current price: $
                  {selectedStock.current_price}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.min(
                    Math.max(1, parseInt(e.target.value)),
                    getUserStockQuantity(selectedStock?.id)
                  )
                )
              }
              min="1"
              max={getUserStockQuantity(selectedStock?.id)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSellModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSellConfirm}>Confirm Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockList;
