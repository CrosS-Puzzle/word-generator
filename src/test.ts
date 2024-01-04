import { config } from 'dotenv';

config();

export const test = async () => {
  console.log('test called');
  console.log(process.env.OPEN_AI_API_KEY);
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content:
            'Select 1 random computer science terms, return the terms and their explanations in JSON format. When returning, provide the terms in Korean and explanations in Korean. Descriptions should be within 30 characters. For Example: { result: [["TCP", "두 개의 호스트를 연결하고 데이터 스트림을 교환하게 해주는 중요한 네트워크 프로토콜입니다. TCP는 데이터와 패킷이 보내진 순서대로 전달하는 것을 보장해줍니다."]]}',
        },
      ],
      model: 'gpt-3.5-turbo-1106',
      response_format: { type: 'json_object' },
      temperature: 1.2,
    }),
  });

  const data = await response.json();

  console.log(data);
  console.log(data.choices);

  return data;
};
