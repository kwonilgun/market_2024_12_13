import {LayoutAnimation} from 'react-native';
import {IOrderInfo} from '../model/interface/IOrderInfo';

type DataListItem = {
  isExpanded: boolean; // 섹션이 확장되었는지 여부
  title: string; // 섹션의 제목 (연도와 월)
  subtitle: IOrderInfo[]; // 해당 월에 대한 데이터 배열
};

export type DataList = DataListItem[]; // 전체 데이터 리스트 타입

// 2023-10-19: Create expandable data list
export function makeExpandableDataList(
  lists: IOrderInfo[],
  setDataList: (dataList: DataList) => void,
): void {
  const groupedData = lists.reduce<Record<string, any[]>>((acc, item) => {
    const date = new Date(item.dateOrdered);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const yearMonth = `${year}-${month}`;

    if (!acc[yearMonth]) {
      acc[yearMonth] = [];
    }
    acc[yearMonth].push(item);

    return acc;
  }, {});

  const dataList: DataList = Object.keys(groupedData).map(key => {
    const value = groupedData[key];
    return {
      isExpanded: false, // Should the section be expanded?
      title: key, // The key represents the year and month
      subtitle: value, // The data for the corresponding month
    };
  });

  console.log('makeExpandableDataList: dataList = ', dataList);

  setDataList(dataList);
}

// 2023-10-18: Toggle isExpanded to allow expansion
export function updateLayout(
  index: number,
  dataList: any[],
  setDataList: (dataList: any[]) => void,
): void {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  const array = [...dataList];

  array.forEach((value, placeIndex) => {
    array[placeIndex].isExpanded =
      placeIndex === index ? !array[placeIndex].isExpanded : false;
  });

  setDataList(array);
}