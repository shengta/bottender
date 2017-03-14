import MockAdapter from 'axios-mock-adapter';

import FBGraphAPIClient from '../FBGraphAPIClient';

const RECIPIENT_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';

const createMock = () => {
  const client = new FBGraphAPIClient(ACCESS_TOKEN);
  const mock = new MockAdapter(client.getHTTPClient());
  return { client, mock };
};

describe('#getHTTPClient', () => {
  it('should return underlying http client', () => {
    const client = new FBGraphAPIClient(ACCESS_TOKEN);
    const http = client.getHTTPClient();
    expect(http.get).toBeDefined();
    expect(http.post).toBeDefined();
    expect(http.put).toBeDefined();
    expect(http.delete).toBeDefined();
  });
});

describe('user', () => {
  describe('#getUser', () => {
    it('should response user profile', async () => {
      const { client, mock } = createMock();
      const expected = {
        first_name: '薄餡',
        last_name: '茱',
        profile_pic: 'https://example.com/pic.png',
        locale: 'en_US',
        timezone: 8,
        gender: 'male',
      };

      mock.onGet(`/1?access_token=${ACCESS_TOKEN}`).reply(200, expected);

      const res = await client.getUser('1');

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });
});

describe('get started button', () => {
  describe('#getGetStartedButton', () => {
    it('should response data of get started button', async () => {
      const { client, mock } = createMock();

      const expected = {
        data: [
          {
            get_started: {
              payload: '__ALOHA.AI_GET_STARTED__',
            },
          },
        ],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=get_started&access_token=${ACCESS_TOKEN}`,
        )
        .reply(200, expected);

      const res = await client.getGetStartedButton();

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#setGetStartedButton', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const expected = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          get_started: {
            payload: '__ALOHA.AI_GET_STARTED__',
          },
        })
        .reply(200, expected);

      const res = await client.setGetStartedButton('__ALOHA.AI_GET_STARTED__');

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#deleteGetStartedButton', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const expected = {
        result: 'success',
      };

      mock
        .onDelete(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          fields: ['get_started'],
        })
        .reply(200, expected);

      const res = await client.deleteGetStartedButton();

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });
});

describe('persistent menu', () => {
  describe('#getPersistentMenu', () => {
    it('should response data of persistent menu', async () => {
      const { client, mock } = createMock();

      const expected = {
        data: [
          {
            persistent_menu: [
              {
                locale: 'default',
                composer_input_disabled: true,
                call_to_actions: [
                  {
                    type: 'postback',
                    title: '重新開始對話',
                    payload: '__ALOHA.AI_RESTARTED__',
                  },
                  {
                    type: 'web_url',
                    title: 'Powered by ALOHA.AI, Yoctol',
                    url: 'https://www.yoctol.com/',
                  },
                ],
              },
            ],
          },
        ],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=persistent_menu&access_token=${ACCESS_TOKEN}`,
        )
        .reply(200, expected);

      const res = await client.getPersistentMenu();

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#setPersistentMenu', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const expected = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          persistent_menu: [
            {
              locale: 'default',
              composer_input_disabled: false,
              call_to_actions: [
                {
                  type: 'postback',
                  title: '重新開始對話',
                  payload: '__ALOHA.AI_RESTARTED__',
                },
                {
                  type: 'web_url',
                  title: 'Powered by ALOHA.AI, Yoctol',
                  url: 'https://www.yoctol.com/',
                },
              ],
            },
          ],
        })
        .reply(200, expected);

      const items = [
        {
          type: 'postback',
          title: '重新開始對話',
          payload: '__ALOHA.AI_RESTARTED__',
        },
        {
          type: 'web_url',
          title: 'Powered by ALOHA.AI, Yoctol',
          url: 'https://www.yoctol.com/',
        },
      ];

      const res = await client.setPersistentMenu(items);

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });

    it('should support disabled input', async () => {
      const { client, mock } = createMock();

      const expected = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          persistent_menu: [
            {
              locale: 'default',
              composer_input_disabled: true,
              call_to_actions: [
                {
                  type: 'postback',
                  title: '重新開始對話',
                  payload: '__ALOHA.AI_RESTARTED__',
                },
              ],
            },
          ],
        })
        .reply(200, expected);

      const items = [
        {
          type: 'postback',
          title: '重新開始對話',
          payload: '__ALOHA.AI_RESTARTED__',
        },
      ];

      const res = await client.setPersistentMenu(items, {
        inputDisabled: true,
      });

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#deletePersistentMenu', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const expected = {
        result: 'success',
      };

      mock
        .onDelete(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          fields: ['persistent_menu'],
        })
        .reply(200, expected);

      const res = await client.deletePersistentMenu();

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });
});

describe('greeting text', () => {
  describe('#getGreetingText', () => {
    it('should response data of greeting text', async () => {
      const { client, mock } = createMock();

      const expected = {
        data: [
          {
            greeting: [
              {
                locale: 'default',
                text: 'Hello!',
              },
            ],
          },
        ],
      };

      mock.onGet().reply(200, expected);

      const res = await client.getGreetingText();

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#setGreetingText', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const expected = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          greeting: [
            {
              locale: 'default',
              text: 'Hello!',
            },
          ],
        })
        .reply(200, expected);

      const res = await client.setGreetingText('Hello!');

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#deleteGreetingText', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const expected = {
        result: 'success',
      };

      mock
        .onDelete(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          fields: ['greeting'],
        })
        .reply(200, expected);

      const res = await client.deleteGreetingText();

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });
});

describe('domain whitelist', () => {
  describe('#getDomainWhitelist', () => {
    it('should response data of greeting text', async () => {
      const { client, mock } = createMock();

      const expected = {
        data: [
          {
            whitelisted_domains: ['http://www.yoctol.com/'],
          },
        ],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=whitelisted_domains&access_token=${ACCESS_TOKEN}`,
        )
        .reply(200, expected);

      const res = await client.getDomainWhitelist();

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#setDomainWhitelist', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const expected = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          whitelisted_domains: ['www.yoctol.com'],
        })
        .reply(200, expected);

      const res = await client.setDomainWhitelist('www.yoctol.com');

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#deleteDomainWhitelist', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const expected = {
        result: 'success',
      };

      mock
        .onDelete(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          fields: ['whitelisted_domains'],
        })
        .reply(200, expected);

      const res = await client.deleteDomainWhitelist();

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });
});

describe('sned api', () => {
  describe('#send', () => {
    it('should call messages api', async () => {
      const { client, mock } = createMock();

      const expected = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, expected);

      const res = await client.send(RECIPIENT_ID, {
        text: 'Hello!',
      });

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#sendAttachment', () => {
    it('should call messages api with attachment', async () => {
      const { client, mock } = createMock();

      const expected = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            attachment: {
              type: 'image',
              payload: {
                url: 'https://example.com/pic.png',
              },
            },
          },
        })
        .reply(200, expected);

      const res = await client.sendAttachment(RECIPIENT_ID, {
        type: 'image',
        payload: {
          url: 'https://example.com/pic.png',
        },
      });

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#sendText', () => {
    it('should call messages api with text', async () => {
      const { client, mock } = createMock();

      const expected = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, expected);

      const res = await client.sendText(RECIPIENT_ID, 'Hello!');

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#sendAudio', () => {
    it('should call messages api with audio', async () => {
      const { client, mock } = createMock();

      const expected = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            attachment: {
              type: 'audio',
              payload: {
                url: 'https://example.com/audio.mp3',
              },
            },
          },
        })
        .reply(200, expected);

      const res = await client.sendAudio(
        RECIPIENT_ID,
        'https://example.com/audio.mp3',
      );

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#sendImage', () => {
    it('should call messages api with audio', async () => {
      const { client, mock } = createMock();

      const expected = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            attachment: {
              type: 'image',
              payload: {
                url: 'https://example.com/pic.png',
              },
            },
          },
        })
        .reply(200, expected);

      const res = await client.sendImage(
        RECIPIENT_ID,
        'https://example.com/pic.png',
      );

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#sendVideo', () => {
    it('should call messages api with video', async () => {
      const { client, mock } = createMock();

      const expected = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            attachment: {
              type: 'video',
              payload: {
                url: 'https://example.com/video.mp4',
              },
            },
          },
        })
        .reply(200, expected);

      const res = await client.sendVideo(
        RECIPIENT_ID,
        'https://example.com/video.mp4',
      );

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#sendFile', () => {
    it('should call messages api with file', async () => {
      const { client, mock } = createMock();

      const expected = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            attachment: {
              type: 'file',
              payload: {
                url: 'https://example.com/word.docx',
              },
            },
          },
        })
        .reply(200, expected);

      const res = await client.sendFile(
        RECIPIENT_ID,
        'https://example.com/word.docx',
      );

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#sendTemplate', () => {
    it('should call messages api with template', async () => {
      const { client, mock } = createMock();

      const expected = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'title',
                buttons: [
                  {
                    type: 'postback',
                    title: 'Start Chatting',
                    payload: 'USER_DEFINED_PAYLOAD',
                  },
                ],
              },
            },
          },
        })
        .reply(200, expected);

      const res = await client.sendTemplate(RECIPIENT_ID, {
        template_type: 'button',
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      });

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#sendButtonTemplate', () => {
    it('should call messages api with button template', async () => {
      const { client, mock } = createMock();

      const expected = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'title',
                buttons: [
                  {
                    type: 'postback',
                    title: 'Start Chatting',
                    payload: 'USER_DEFINED_PAYLOAD',
                  },
                ],
              },
            },
          },
        })
        .reply(200, expected);

      const res = await client.sendButtonTemplate(RECIPIENT_ID, 'title', [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'USER_DEFINED_PAYLOAD',
        },
      ]);

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#sendGenericTemplate', () => {
    it('should call messages api with generic template', async () => {
      const { client, mock } = createMock();

      const expected = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'generic',
                elements: [
                  {
                    title: "Welcome to Peter's Hats",
                    image_url: 'https://petersfancybrownhats.com/company_image.png',
                    subtitle: "We've got the right hat for everyone.",
                    default_action: {
                      type: 'web_url',
                      url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
                      messenger_extensions: true,
                      webview_height_ratio: 'tall',
                      fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
                    },
                    buttons: [
                      {
                        type: 'postback',
                        title: 'Start Chatting',
                        payload: 'DEVELOPER_DEFINED_PAYLOAD',
                      },
                    ],
                  },
                ],
                image_aspect_ratio: 'square',
              },
            },
          },
        })
        .reply(200, expected);

      const res = await client.sendGenericTemplate(RECIPIENT_ID, [
        {
          title: "Welcome to Peter's Hats",
          image_url: 'https://petersfancybrownhats.com/company_image.png',
          subtitle: "We've got the right hat for everyone.",
          default_action: {
            type: 'web_url',
            url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
            messenger_extensions: true,
            webview_height_ratio: 'tall',
            fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
          },
          buttons: [
            {
              type: 'postback',
              title: 'Start Chatting',
              payload: 'DEVELOPER_DEFINED_PAYLOAD',
            },
          ],
        },
      ]);

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#sendQuickReplies', () => {
    it('should call messages api with quick replies', async () => {
      const { client, mock } = createMock();

      const expected = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            text: 'Pick a color:',
            attachment: null,
            quick_replies: [
              {
                content_type: 'text',
                title: 'Red',
                payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
              },
            ],
          },
        })
        .reply(200, expected);

      const res = await client.sendQuickReplies(
        RECIPIENT_ID,
        'Pick a color:',
        null,
        [
          {
            content_type: 'text',
            title: 'Red',
            payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
          },
        ],
      );

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#setSenderAction', () => {
    it('should call messages api with sender action', async () => {
      const { client, mock } = createMock();

      const expected = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          sender_action: 'typing_on',
        })
        .reply(200, expected);

      const res = await client.setSenderAction(RECIPIENT_ID, 'typing_on');

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#turnTypingIndicatorsOn', () => {
    it('should call messages api with typing_on sender action', async () => {
      const { client, mock } = createMock();

      const expected = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          sender_action: 'typing_on',
        })
        .reply(200, expected);

      const res = await client.turnTypingIndicatorsOn(RECIPIENT_ID);

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });

  describe('#turnTypingIndicatorsOff', () => {
    it('should call messages api with typing_off sender action', async () => {
      const { client, mock } = createMock();

      const expected = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          sender_action: 'typing_off',
        })
        .reply(200, expected);

      const res = await client.turnTypingIndicatorsOff(RECIPIENT_ID);

      expect(res.status).toBe(200);
      expect(res.data).toBe(expected);
    });
  });
});