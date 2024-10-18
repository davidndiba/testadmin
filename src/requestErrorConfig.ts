import { history, type RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';

enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

interface ResponseStructure {
  success: boolean;
  status: number;
  statusText: string;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

export const errorConfig: RequestConfig = {
  errorConfig: {
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    errorHandler: (error: any, opts: any) => {
      console.log(error?.response?.status, opts);
      if (
        error?.response?.status === 401 &&
        history.location.pathname !== '/user/login'
        && 
        !history.location.pathname.includes("/auth/confirm-email")
      ) {
        return history.push('/user/login');
      }
      if (opts?.skipErrorHandler) return;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // console.log(error);
        // message.error(`Response status: ${error.response.status}`);
        if (history.location.pathname !== '/home')
          notification.open({
            placement: 'bottomRight',
            message: `${error?.response?.data?.message ?? error.message}`,
            type: 'error',
          });
      } else if (error.request) {
        message.error('None response! Please retry.');
      } else {
        message.error('Request error, please retry.');
      }
    },
  },

  requestInterceptors: [
    (config: any) => {
      if (config.login === undefined) {
        const token = localStorage.getItem('planner_t');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          config.headers.Accept = `application/json`;
        }
      }
      const url = API + config?.url;
      return { ...config, url };
    },
  ],

  responseInterceptors: [
    (response: any) => {
      const { data, status, statusText } = response;

      if ((data && status === 200) || status === 201) {
        return {
          status: true,
          code: status,
          data,
        };
      }

      if (status === 401 && history.location.pathname !== `/user/login`) {
        localStorage.removeItem('planner_t');
        localStorage.removeItem('planner_rf');

        notification.error({
          message: 'Access Denied',
          placement: 'bottomRight',
        });
        window.location.replace('/user/login');
      }

      if (status >= 400 && status < 422) {
        notification.error({
          message: ` ${statusText} ( ${status} )`,
          description: data?.error_description || message,
          placement: 'bottomRight',
        });
        return {
          status: true,
          code: status,
          message,
          data,
        };
      }

      return response;
    },
  ],
};
