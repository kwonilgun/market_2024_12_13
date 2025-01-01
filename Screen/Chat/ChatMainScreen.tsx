/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {RFPercentage} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import isEmpty from '../../utils/isEmpty';
import LoadingWheel from '../../utils/loading/LoadingWheel';
import WrapperContainer from '../../utils/basicForm/WrapperContainer';
import HeaderComponent from '../../utils/basicForm/HeaderComponents';
import {ChatMainScreenProps} from '../model/types/TUserNavigator';
import {useAuth} from '../../context/store/Context.Manager';
import {ISocket} from '../model/interface/ISocket';
import {io, Socket} from 'socket.io-client';
import {baseURL, socketURL} from '../../assets/common/BaseUrl';
// import DeviceInfo from 'react-native-device-info';
import {SocketItem} from '../../Redux/Cart/Reducers/socketItems';
import {connect} from 'react-redux';
import * as actions from '../../Redux/Cart/Actions/socketActions';
import {useFocusEffect} from '@react-navigation/native';
import {getToken} from '../../utils/getSaveToken';
import axios, {AxiosResponse} from 'axios';
import {IUserAtDB} from '../model/interface/IAuthInfo';
import {alertMsg} from '../../utils/alerts/alertMsg';
import strings from '../../constants/lang';
import {height, MANAGER_ID} from '../../assets/common/BaseValue';
import RoundImage from '../../utils/basicForm/RoundImage';
import {useRoute} from '@react-navigation/native';
// import {IMessage} from '../model/interface/IMessage';
// import {GiftedChat, IMessage} from 'react-native-gifted-chat';
import {IMessage} from './GiftedChat/Models';
import GiftedChat, {GiftedChatAppend} from './GiftedChat/GiftedChat';
import {ImageBackground} from 'react-native';
import imagePath from './GiftedChat/assets/constatns/imagePath';
import GlobalStyles from '../../styles/GlobalStyles';
import {InputToolbar} from './GiftedChat/InputToolbar';

const ChatMainScreen: React.FC<ChatMainScreenProps> = props => {
  const [loading, setLoading] = useState<boolean>(true);
  const {socketState, socketDispatch} = useAuth();
  const [managers, setManagers] = useState<IUserAtDB | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const pingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const pongInterval = useRef<ReturnType<typeof setTimeout> | null>(null);
  const route = useRoute();

  useFocusEffect(
    useCallback(() => {
      setLoading(false);

      if (isEmpty(socketState.socketId)) {
        console.log('현재 화면 이름:', route.name);
        console.log('useFocusEffect ... 소켓 비어있음');
        fetchManagerData();
        // activateSocket(MANAGER_ID);
        initSetMessage();

        // 2024-12-30 : 일단은 Manager를 producer로 설정하고 진행한다.
      } else {
        console.log('ChatMainScreen: 이미 소켓이 있음', socketState.socketId);
        return;
      }

      return () => {
        console.log('ChatMainScreen: useEffect : exit 한다.');

        setLoading(true);
        setLoading(true);
      };
    }, [socketState.socketId]),
    //     }, []),
  );

  //   // 메세지를 전송한다.
  //   useEffect(() => {
  //     if (messages !== null) {
  //       console.log('ChatMainScreen sendMessage', messages);

  //       if (socketState.socketId) {
  //         socketState.socketId.emit('send-message', messages);
  //       }
  //     }
  //   }, [messages]);

  const initSetMessage = () => {
    setMessages([
      {
        _id: 1,
        text: 'Hello manager',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Kwon',
        },
        image: '',
      },
    ]);
  };

  // const onSend = useCallback(
  //   (newMessages: IMessage[]) => {
  //     console.log('onSend messages:', newMessages);
  //     if (socketState.socketId) {
  //       socketState.socketId.emit('send-message', newMessages);
  //     }
  //     setMessages(prevMessages => [...prevMessages, ...newMessages]); // Update local state
  //   },
  //   [socketState.socketId],
  // );

  const onSend = useCallback((messages = []) => {
    console.log('onSend messages ', messages);
    setMessages(previousMessages =>
      GiftedChatAppend(previousMessages, messages),
    );
  }, []);

  const fetchManagerData = async () => {
    console.log('fetchManagerData');
    try {
      const token = await getToken();
      //헤드 정보를 만든다.
      const config = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`,
        },
      };
      const response: AxiosResponse = await axios.get(
        `${baseURL}users/${MANAGER_ID}`,
        config,
      );
      if (response.status === 200) {
        console.log('Manager data = ', response.data);
        setManagers(response.data);

        setLoading(false);
      }
    } catch (error) {
      alertMsg(strings.ERROR, '매니저 데이타 다운로드 실패');
    }
  };

  //id는
  async function activateSocket(id: string) {
    console.log('activateSocket...');

    const socket: Socket = io(socketURL); // 서버 주소를 입력하세요

    socketDispatch({type: 'SET_SOCKET_ID', socketId: socket});

    // 초기 변수 설정
    const socketData: ISocket = {
      id: '', // 서버 연결 후 할당
      socketId: socket,
      pingInterval: null, // 예: 5초
      pongInterval: null, // 예: 5초
    };

    props.addToSocket({socket: socketData});

    // 서버와의 연결 이벤트 처리
    socket.on('connect', () => {
      socketData.id = socket.id!; // 연결된 소켓 ID 할당
      console.log('Connected to server:', socketData);
    });

    socketData.pingInterval = pingInterval.current = setInterval(() => {
      // console.log('activateSocket : ping을 보낸다.', id);
      socket.emit('ping', '핑을 보냅니다: from ' + id);

      socketData.pongInterval = pongInterval.current = setTimeout(() => {
        //  handleLogout(socketData.pingInterval, props); // 특정 시간 내에 pong을 받지 못하면
        console.log('activateSocket:특정시간을 pong을 받지 못했다.');

        props.addToSocket({socket: socketData});
      }, 5000); //     }, PONG_TIMEOUT); //5초
    }, 25000); // 20초  // }, PING_INTERVAL); // 20초

    // 2023-09-17 : pong을 받으면 세팅된 pongInterval.current에 해당되는 setTimeout을 해제한다. 10초 간의 모니터링을 통해서 연결이 살아있는 지 확인을 한다.
    socket.on('ping', res => {
      // console.log(' ping을 받음 = ', res);
      if (!isEmpty(socketData.pingInterval)) {
        clearTimeout(socketData.pongInterval!);
        socketData.pongInterval = null;
      }
    });

    // 서버로부터 메시지 수신 예제
    socket.on('message', (data: IMessage) => {
      console.log('Message from server:', data);
      setMessages(prevMessages => [...prevMessages, data]);
    });

    // 연결 종료 이벤트 처리
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  const stopPingSend = () => {
    console.log('ChatMainScreen: stopPingSend....');
    if (socketState.socketId) {
      // 소켓 연결 종료
      console.log('Socket disconnected.');
      socketState.socketId.disconnect();
      socketDispatch({type: 'RESET'});
      props.clearSocket();

      console.log('props.socket = ', props.socketItem);

      //pingInterval 및 pongInterval 정리
      if (pingInterval.current) {
        clearInterval(pingInterval.current);
      }
      if (pongInterval.current) {
        clearTimeout(pongInterval.current);
      }
    }
    setLoading(true);
    setLoading(true);
  };

  const onPressLeft = () => {
    stopPingSend();
    props.navigation.navigate('UserMain', {screen: 'ProfileScreen'});
  };

  const LeftCustomComponent = () => {
    return (
      <View style={styles.listContainer}>
        <TouchableOpacity onPress={onPressLeft}>
          <FontAwesome
            style={{
              // height: RFPercentage(8),
              // width: RFPercentage(10),
              marginHorizontal: RFPercentage(1),
              color: colors.black,
              fontSize: RFPercentage(5),
              fontWeight: 'bold',
              // transform: [{scaleX: 1.5}], // 폭을 1.5배 넓힘
            }}
            name="arrow-left"
          />
        </TouchableOpacity>
        <RoundImage
          size={RFPercentage(4)}
          image={require('../../assets/images/ozs_logo.png')}
          isStatic={true}
        />
        <Text style={{marginHorizontal: RFPercentage(1)}}>
          {managers?.nickName.split('@')[0]}
        </Text>
      </View>
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.primaryToolbar}
      />
    );
  };

  return (
    <WrapperContainer containerStyle={{paddingHorizontal: 0}}>
      <HeaderComponent
        rightPressActive={false}
        centerText="채팅"
        containerStyle={{paddingHorizontal: 8}}
        isLeftView={true}
        leftCustomView={LeftCustomComponent}
        isRight={false}
      />
      <>
        {loading ? (
          <LoadingWheel />
        ) : (
          <View style={GlobalStyles.VStack}>
            <ImageBackground
              source={imagePath.icBigLight}
              style={{
                flex: 1,
                marginTop: RFPercentage(1),
                height: 'auto',
              }}>
              <GiftedChat
                messages={messages}
                onSend={onSend}
                renderInputToolbar={renderInputToolbar}
                user={{
                  _id: 1,
                  name: 'Manager',
                }}

                // Add other props to customize the chat UI
              />
            </ImageBackground>
          </View>
        )}
      </>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  inputToolbar: {
    marginTop: RFPercentage(0.5),
    height: RFPercentage(5),
    backgroundColor: '#f0f0f0', // 배경색 변경
    borderWidth: 1,
    borderRadius: RFPercentage(1),
    // ㅇborderColor: 'blue', // 테두리 색상 변경
    // padding: RFPercentage(0.5),
  },
  primaryToolbar: {
    alignItems: 'center',
  },
  headerContainer: {
    padding: 10,
  },
  listContainer: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.06,
    // margin: RFPercentage(1),
    // padding: RFPercentage(2),
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'red',
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
  },
  itemContainer: {
    marginBottom: 10,
  },
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    //     changeSocket: (item: any) =>
    //       dispatch(actions.changeSocket({item:SocketItem})),
    clearSocket: () => dispatch(actions.clearSocket()),
    removeFromSocket: () =>
      dispatch(actions.removeFromSocket({socket: undefined})),
    addToSocket: (item: SocketItem) => dispatch(actions.addToSocket(item)),
  };
};

// export default ChatMainScreen;
const mapStateToProps = (state: any) => {
  const {socketItem} = state;
  return {
    socketItem,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatMainScreen);
