import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const { doRequest } = useRequest({url: '/api/users/signout', method: 'post',
    body: {},
    onSuccess: () => Router.push('/') //navigate to / page
  });

  useEffect(() => {
    doRequest();
  }, []); //run only one time

  return <div>Signing you out...</div>; // this message will be displayed to user
};
