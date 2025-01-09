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
  FlatList,
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
import {IUserAtDB, UserFormInput} from '../model/interface/IAuthInfo';
import {alertMsg} from '../../utils/alerts/alertMsg';
import strings from '../../constants/lang';
import {
  height,
  MANAGER_ID,
  MANAGER_NICKNAME,
} from '../../assets/common/BaseValue';
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
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {IChatUserInfo} from './ChatRegisterScreen';

const ChatMainScreen: React.FC<ChatMainScreenProps> = props => {
  const [loading, setLoading] = useState<boolean>(true);
  const {state, socketState, socketDispatch} = useAuth();
  const [managers, setManagers] = useState<IUserAtDB | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);

  const [activeChatUsers, setActiveChatUsers] = useState<any[]>([]); // For user list
  const [chatUsers, setChatUsers] = useState<IChatUserInfo[] | null>(null);
  const [showChat, setShowChat] = useState<boolean>(false); // To toggle between user list and chat
  const [selectedUser, setSelectedUser] = useState<IChatUserInfo | null>(null);

  const pingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const pongInterval = useRef<ReturnType<typeof setTimeout> | null>(null);
  const route = useRoute();
  const chatRoomIdRef = useRef<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setLoading(false);

      // console.log('useFocusEffect sockeId = ', socketState.socketId);

      if (isEmpty(socketState.socketId)) {
        console.log('현재 화면 이름:', route.name);
        console.log('useFocusEffect ... 소켓 비어있음');
        fetchChatUsers();
        activateSocket();
        // initSetMessage();

        // 2024-12-30 : 일단은 Manager를 producer로 설정하고 진행한다.
      } else {
        console.log('ChatMainScreen: 이미 소켓이 있음');
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

  // 서버에서 메시지 불러오기
  const fetchChatUsers = async () => {
    console.log('fetchChatUsers');
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
        `${baseURL}messages/chatList`,
        config,
      );
      if (response.status === 200) {
        // console.log('Manager data = ', response.data);
        const chatUser = response.data.filter((item: IChatUserInfo) => {
          return item.email !== state.user?.nickName;
        });
        setChatUsers(chatUser);

        setLoading(false);
      }
    } catch (error) {
      alertMsg(strings.ERROR, '매니저 데이타 다운로드 실패');
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const token = await getToken();
      const config = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`,
        },
        params: {chatRoomId: roomId},
      };
      const response = await axios.get(
        `${baseURL}messages/`,

        // JSON.stringify({chatRoomId: roomId}),
        config,
      );

      // console.log('fetchMessages:  response.data = ', response.data);
      if (!isEmpty(response.data)) {
        const formattedMessages = response.data.map((item: any) => ({
          _id: item.messageId,
          text: item.text,
          createdAt: new Date(item.createdAt),
          user: item.user,
        }));
        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const onSend = useCallback(
    async (messages = []) => {
      console.log('onSend messages ', messages);
      if (socketState.socketId) {
        try {
          const token = await getToken();
          const config = {
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              Authorization: `Bearer ${token}`,
            },
          };

          const newMessage = messages.map((item: IMessage) => {
            return {
              chatRoomId: chatRoomIdRef.current,
              createdAt: item.createdAt.toString(),
              messageId: item._id,
              text: item.text,
              user: item.user,
            };
          });

          console.log('onSend newMessage = ', newMessage[0]);

          await axios.post(
            `${baseURL}messages`,
            JSON.stringify(newMessage[0]),
            config,
          );

          socketState.socketId.emit('send-message', ...messages);
          setMessages(previousMessages =>
            GiftedChatAppend(previousMessages, messages),
          );

          // console.log('response = ', response);
        } catch (error) {}
      }
    },
    [socketState.socketId],
  );

  //id는
  async function activateSocket() {
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
      // console.log('Connected to server:', socketData);
    });

    socketData.pingInterval = pingInterval.current = setInterval(() => {
      // console.log('activateSocket : ping을 보낸다.', id);
      socket.emit('ping', '핑을 보냅니다: from ' + state.user?.userId);

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

    //2025-01-02 : 나 자신을 새로운 유저에 등록한다. 그러면 get-users 가 날라온다.
    socket.emit('new-user-add', state.user);

    // 서버로부터 메시지 수신 예제
    socket.on('receive-message', (data: any) => {
      console.log('Message from server:', data);
      setMessages(prevMessages => GiftedChatAppend(prevMessages, [data]));
    });

    // if (state.user?.userId! !== MANAGER_ID) {
    socket.on('get-users', users => {
      console.log('socketTurnOn:소켓으로 get-users 받음= ', users);

      // const newList = users.filter(
      //   (user: UserFormInput) => user.userId !== state.user?.userId!,
      // );

      // console.log('get-users newList = ', newList);
      // setActiveChatUsers(newList);
    });
    // }

    // 연결 종료 이벤트 처리
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  const makeRoomId = (item: IChatUserInfo): string => {
    return [state.user?.nickName!.split('@')[0], item.email!.split('@')[0]]
      .sort()
      .join('-');
  };

  const startChat = (item: IChatUserInfo) => {
    if (socketState.socketId) {
      const roomId = makeRoomId(item);
      console.log('roomId = ', roomId);
      chatRoomIdRef.current = roomId;

      socketState.socketId.emit('chat-opened', {
        chatRoomId: roomId,
        userId: state.user?.userId,
      });

      setChatRoomId(roomId);
      setSelectedUser(item);
      fetchMessages(roomId);

      setShowChat(true);
    } else {
      console.log('socketState.socketId is empty');
    }
  };

  const renderUserList = () => (
    <View style={styles.userListContainer}>
      <Text style={styles.title}>대화 리스트</Text>
      <FlatList
        data={chatUsers}
        keyExtractor={item => item.email}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => {
              startChat(item);
            }} // Navigate to chat when a user is selected
          >
            <Text style={styles.userName}>{item.email.split('@')[0]}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}> 리스트 없음.</Text>
        }
      />
    </View>
  );

  const renderChat = () => (
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
          _id: selectedUser?.userId!,
          name: state.user?.nickName!.split('@')[0],
        }}
      />
    </ImageBackground>
  );

  const stopPingSend = () => {
    console.log('ChatMainScreen: stopPingSend....');
    if (socketState.socketId) {
      socketState.socketId.emit('chat-closed', {
        chatRoomId: chatRoomIdRef.current,
        userId: state.user?.userId,
      });

      // 소켓 연결 종료
      console.log('Socket disconnected.');
      socketState.socketId.disconnect();

      console.log('props.socket = ', props.socketItem);
    }
    socketDispatch({type: 'RESET'});
    props.clearSocket();
    //pingInterval 및 pongInterval 정리
    if (pingInterval.current) {
      clearInterval(pingInterval.current);
    }
    if (pongInterval.current) {
      clearTimeout(pongInterval.current);
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
          {state.user?.nickName!.split('@')[0]}
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
            <>
              {loading ? (
                <LoadingWheel />
              ) : showChat ? (
                renderChat()
              ) : (
                renderUserList()
              )}
            </>
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
  userListContainer: {
    padding: 10,
  },
  userItem: {
    padding: 10,
    marginBottom: 5,
    backgroundColor: colors.grey,
    borderRadius: 5,
  },
  userName: {
    fontSize: 16,
    color: colors.black,
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
  emptyMessage: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
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
