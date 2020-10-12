import { ApiService } from '@/services';
import { UploadRequestStore, PasswordStore } from '@/store';

async function checkError(id, pw) {
  try {
    const password = pw ? pw : PasswordStore.get(id);
    const uploadRequest = await ApiService.getById('requests', id, {
      headers: {
        'linshare-uploadrequest-password': password
      }
    });

    UploadRequestStore.assign(id, uploadRequest.data);
    
    return;
  } catch (error) {
    UploadRequestStore.assign(id, {});

    return error;
  }
}

async function checkPasswordError(id, password) {
  const error = await checkError(id, password);
  
  return !(error && error.response && error.response.status === 401
    && error.response.data && error.response.data.errCode === 32401);
}

export const ErrorService = {
  checkError,
  checkPasswordError
};
