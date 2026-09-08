import React, {useMemo, useState} from 'react';
import {List} from './List';
import {HomePage, DownloadPage, UploadPage, PageSection} from './pages';

const Pages: PageSection[] = [
  {
    title: 'Foundation Usages',
    data: [
      {title: 'Download Example', name: 'Download', section: 0},
      {title: 'Upload Example', name: 'Upload', section: 0},
    ],
  },
];

export const Main = () => {
  const [name, setName] = useState('Home');

  const Page = useMemo(() => {
    switch (name) {
      case 'Download':
        return DownloadPage;
      case 'Upload':
        return UploadPage;
      default:
        return null;
    }
  }, [name]);

  if (Page) {
    return <Page back={() => setName('Home')} />;
  }

  return (
    <HomePage>
      <List sections={Pages} set={setName} />
    </HomePage>
  );
};
