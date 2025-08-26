import { useState } from 'react';
import toast from 'react-hot-toast';

const RoleRequestModal = ({ 
  isOpen, 
  onClose, 
  roleRequests, 
  onApprove, 
  onDeny, 
  currentUser 
}) => {
  const [processing, setProcessing] = useState({});

  if (!isOpen) return null;

  const handleAction = async (username, action) => {
    if (processing[username]) return;
    
    setProcessing(prev => ({ ...prev, [username]: true }));
    
    try {
      if (action === 'approve') {
        await onApprove(username);
        toast.success(`Approved editor role for ${username}`);
      } else {
        await onDeny(username);
        toast.success(`Denied editor role for ${username}`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} role for ${username}`);
    } finally {
      setProcessing(prev => ({ ...prev, [username]: false }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-black rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center dark:bg-slate-950 justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Role Requests
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {roleRequests.length} pending request{roleRequests.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {roleRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Pending Requests
              </h4>
              <p className="text-gray-500 dark:text-gray-400">
                All role requests have been processed
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {roleRequests.map((request, index) => (
                <div 
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-black/60 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-700/50 text-white rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {request.requester?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {request.requester}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Requested
                            </p>
                          </div>
                        </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                      Pending
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                                              <button
                            onClick={() => handleAction(request.requester, 'approve')}
                            disabled={processing[request.requester]}
                            className="flex-1 bg-gray-50 hover:bg-gray-200 disabled:bg-green-400 text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            {processing[request.requester] ? (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span>Approve</span>
                    </button>
                    
                                              <button
                            onClick={() => handleAction(request.requester, 'deny')}
                            disabled={processing[request.requester]}
                            className="flex-1 bg-black/50 hover:bg-black/70 disabled:bg-red-400 text-white border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            {processing[request.requester] ? (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span>Deny</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t  dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleRequestModal;
