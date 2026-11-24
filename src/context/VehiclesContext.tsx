import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Vehicle,
  VehicleStatus,
  FilterParams,
  SavedSearch,
  Report,
  NotificationItem,
} from '../types';
import { MOCK_VEHICLES } from '../data/mockData';

interface VehiclesContextType {
  vehicles: Vehicle[];
  approvedVehicles: Vehicle[];
  favorites: string[];
  compareList: Vehicle[];
  recentlyViewed: Vehicle[];
  savedSearches: SavedSearch[];
  reports: Report[];
  notifications: NotificationItem[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addToCompare: (vehicle: Vehicle) => boolean;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  addRecentlyViewed: (vehicle: Vehicle) => void;
  addVehicle: (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'favorites_count'>) => Vehicle;
  updateVehicleStatus: (id: string, status: VehicleStatus) => void;
  markAsSold: (id: string) => void;
  deleteVehicle: (id: string) => void;
  incrementViews: (id: string) => void;
  addReport: (reportData: Omit<Report, 'id' | 'created_at' | 'status'>) => void;
  updateReportStatus: (id: string, status: 'reviewed' | 'dismissed') => void;
  addSavedSearch: (title: string, filters: FilterParams) => void;
  removeSavedSearch: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Xush kelibsiz!',
    message: 'AVTOBOZOR.UZ platformasiga xush kelibsiz. Eng yaxshi avtomobil e\'lonlari sizni kutmoqda.',
    type: 'success',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif-2',
    title: 'Narx pasayishi kuzatildi',
    message: 'Sevimlilar ro\'yxatidagi Chevrolet Cobalt 2024 narxi 2 000 000 so\'mga pasaytirildi.',
    type: 'price_drop',
    is_read: false,
    link: '/vehicle/veh-001',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
];

const VehiclesContext = createContext<VehiclesContextType | undefined>(undefined);

export const VehiclesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Vehicles state with persistence (ensures base catalogue & veh-11 are always intact)
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('avtobozor_vehicles');
    if (saved) {
      try {
        const parsed: Vehicle[] = JSON.parse(saved);
        const map = new Map<string, Vehicle>();
        MOCK_VEHICLES.forEach((v) => map.set(v.id, v));
        parsed.forEach((v) => map.set(v.id, { ...map.get(v.id), ...v }));
        return Array.from(map.values());
      } catch (e) {
        return MOCK_VEHICLES;
      }
    }
    return MOCK_VEHICLES;
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('avtobozor_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['veh-001', 'veh-003'];
      }
    }
    return ['veh-001', 'veh-003'];
  });

  // Compare state (up to 4 cars)
  const [compareList, setCompareList] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('avtobozor_compare');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Recently viewed
  const [recentlyViewed, setRecentlyViewed] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('avtobozor_recent');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Saved searches
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    const saved = localStorage.getItem('avtobozor_saved_searches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'search-1',
        user_id: 'usr-101',
        title: 'Chevrolet Cobalt (2022-2024, Toshkent)',
        filters: {
          brand: 'Chevrolet',
          model: 'Cobalt',
          minYear: 2022,
          maxYear: 2024,
          region: 'Toshkent shahri',
        },
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  });

  // Reports
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('avtobozor_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'rep-1',
        vehicle_id: 'veh-002',
        vehicle_title: 'Chevrolet Gentra 1.5 MT 2022',
        reporter_phone: '+998 90 999 88 77',
        reason: 'wrong_info',
        details: 'Yurgan masofasi noto\'g\'ri ko\'rsatilgan, avariyada bo\'lgan.',
        status: 'pending',
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('avtobozor_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Persist vehicles
  useEffect(() => {
    localStorage.setItem('avtobozor_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('avtobozor_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Persist compare
  useEffect(() => {
    localStorage.setItem('avtobozor_compare', JSON.stringify(compareList));
  }, [compareList]);

  // Persist recently viewed
  useEffect(() => {
    localStorage.setItem('avtobozor_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Persist saved searches
  useEffect(() => {
    localStorage.setItem('avtobozor_saved_searches', JSON.stringify(savedSearches));
  }, [savedSearches]);

  // Persist reports
  useEffect(() => {
    localStorage.setItem('avtobozor_reports', JSON.stringify(reports));
  }, [reports]);

  // Persist notifications
  useEffect(() => {
    localStorage.setItem('avtobozor_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const approvedVehicles = vehicles.filter((v) => v.status === 'approved');

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      const updated = isFav ? prev.filter((item) => item !== id) : [...prev, id];
      // Also update favorites_count on vehicle
      setVehicles((vList) =>
        vList.map((v) => {
          if (v.id === id) {
            return {
              ...v,
              favorites_count: isFav ? Math.max(0, v.favorites_count - 1) : v.favorites_count + 1,
            };
          }
          return v;
        })
      );
      return updated;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addToCompare = (vehicle: Vehicle): boolean => {
    if (compareList.length >= 4) {
      return false;
    }
    if (compareList.some((item) => item.id === vehicle.id)) {
      return true;
    }
    setCompareList((prev) => [...prev, vehicle]);
    return true;
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((item) => item.id !== id));
  };

  const isInCompare = (id: string) => compareList.some((item) => item.id === id);

  const clearCompare = () => setCompareList([]);

  const addRecentlyViewed = (vehicle: Vehicle) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((v) => v.id !== vehicle.id);
      return [vehicle, ...filtered].slice(0, 10);
    });
  };

  const addVehicle = (
    vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'favorites_count'>
  ): Vehicle => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views_count: 0,
      favorites_count: 0,
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicleStatus = (id: string, status: VehicleStatus) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status, updated_at: new Date().toISOString() } : v))
    );
  };

  const markAsSold = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'sold', updated_at: new Date().toISOString() } : v))
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
    setCompareList((prev) => prev.filter((c) => c.id !== id));
  };

  const incrementViews = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, views_count: v.views_count + 1 } : v))
    );
  };

  const addReport = (reportData: Omit<Report, 'id' | 'created_at' | 'status'>) => {
    const newReport: Report = {
      ...reportData,
      id: `rep-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const updateReportStatus = (id: string, status: 'reviewed' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const addSavedSearch = (title: string, filters: FilterParams) => {
    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      user_id: 'usr-101',
      title,
      filters,
      created_at: new Date().toISOString(),
    };
    setSavedSearches((prev) => [newSearch, ...prev]);
  };

  const removeSavedSearch = (id: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <VehiclesContext.Provider
      value={{
        vehicles,
        approvedVehicles,
        favorites,
        compareList,
        recentlyViewed,
        savedSearches,
        reports,
        notifications,
        toggleFavorite,
        isFavorite,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        addRecentlyViewed,
        addVehicle,
        updateVehicleStatus,
        markAsSold,
        deleteVehicle,
        incrementViews,
        addReport,
        updateReportStatus,
        addSavedSearch,
        removeSavedSearch,
        markNotificationAsRead,
        clearNotifications,
      }}
    >
      {children}
    </VehiclesContext.Provider>
  );
};

export const useVehicles = (): VehiclesContextType => {
  const context = useContext(VehiclesContext);
  if (!context) {
    throw new Error('useVehicles must be used within a VehiclesProvider');
  }
  return context;
};
