import { createContext, useContext, useEffect, useState } from "react";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

// Use your RevenueCat API keys
const APIKeys = {
  apple: "appl_nNlwpoegqhBIBGqaalmaafwblsc",
};

const RevenueCatContext = createContext(/*<RevenueCatProps | null>*/ null);

// Export context for easy usage
export const useRevenueCat = () => {
  return useContext(RevenueCatContext);
};

// Provide RevenueCat functions to our app
export const RevenueCatProvider = ({ children }) => {
  const [user, setUser] = useState(
    /*<UserState>*/ {
      golden: false,
      subStartDate: "",
      subEndDate: "",
      periodType: "",
      entitlement: "",
    }
  );
  const [packages, setPackages] = useState(/*<PurchasesPackage[]>*/ []);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await Purchases.configure({ apiKey: APIKeys.apple });

      setIsReady(true);

      // Use more logging during debug if want!
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);

      // Listen for customer updates
      Purchases.addCustomerInfoUpdateListener(async (info) => {
        updateCustomerInformation(info);
      });

      // Load all offerings and the user object with entitlements
      await loadOfferings();
    };
    init();
  }, []);

  // Load all offerings a user can (currently) purchase
  const loadOfferings = async () => {
    const offerings = await Purchases.getOfferings();
    if (offerings.current) {
      setPackages(offerings.current.availablePackages);
    }
  };

  // Update user state based on previous purchases
  const updateCustomerInformation = async (customerInfo /*: CustomerInfo*/) => {
    if (customerInfo?.entitlements.active["Golden Version"] !== undefined) {
      setUser({
        golden: customerInfo?.entitlements.active["Golden Version"].isActive,
        entitlement:
          customerInfo.entitlements.active["Golden Version"].productIdentifier,
        periodType:
          customerInfo.entitlements.active["Golden Version"].periodType,
        subStartDate:
          customerInfo.entitlements.active["Golden Version"].latestPurchaseDate,
        subEndDate:
          customerInfo.entitlements.active["Golden Version"].expirationDate,
      });
    }
  };

  // Purchase a package
  const purchasePackage = async (pack /*: PurchasesPackage*/) => {
    try {
      await Purchases.purchasePackage(pack);
    } catch (e) {
      if (!e.userCancelled) {
        alert(e);
      }
    }
  };

  // Restore previous purchases
  const restorePermissions = async () => {
    const customer = await Purchases.restorePurchases();
    return customer;
  };

  // Restore previous purchases
  const presentCodeRedemptionSheet = async () => {
    try {
      await Purchases.presentCodeRedemptionSheet();
    } catch (e) {
      if (!e.userCancelled) {
        alert(e);
      }
    }
  };

  const value = {
    restorePermissions,
    user,
    packages,
    purchasePackage,
    presentCodeRedemptionSheet,
  };

  // Return empty fragment if provider is not ready (Purchase not yet initialised)
  if (!isReady) return <></>;

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};
