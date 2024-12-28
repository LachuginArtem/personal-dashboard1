import React, { useState } from 'react';

const Form = () => {
  const [formData, setFormData] = useState({
    top_n: '',
    gender: '',
    age: '',
    sport: '',
    foreign: '',
    gpa: '',
    points: 0,
    bonus_points: '',
    exams: [],
    reception_form: '',
    priority: '',
    education: '',
    study_form: ''
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      if (name === 'exams') {
        const updatedExams = prevData.exams.includes(value)
          ? prevData.exams.filter(exam => exam !== value)
          : [...prevData.exams, value];
        return { ...prevData, exams: updatedExams };
      }
      return { ...prevData, [name]: value };
    });
  };

  const egeExams = [
    'Русский язык',
    'Математика',
    'Физика',
    'Химия',
    'Биология',
    'Информатика',
    'История',
    'Обществознание',
    'Литература',
    'География',
    'Иностранный язык',
  ];

  const handleExamClick = (exam) => {
    setFormData(prevFormData => {
      const updatedExams = prevFormData.exams.includes(exam)
        ? prevFormData.exams.filter(item => item !== exam)
        : [...prevFormData.exams, exam];
      return { ...prevFormData, exams: updatedExams };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Отправляемые данные:', JSON.stringify(formData, null, 2));

    try {
      const token = localStorage.getItem('authToken'); // Исправили на 'authToken'
      console.log('Токен:', token); // Логируем токен

      const response = await fetch(
        'https://personal-account-fastapi.onrender.com/predict/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData, null, 2),
        }
      );

      console.log("Ответ сервера:", response);

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Полученные данные:", data);

      if (data.status === 'ok') {
        console.log("Рекомендации:", data.data);
        setResponseMessage('Данные успешно отправлены!');
        setRecommendations(data.data);
        setIsModalOpen(true);
      } else {
        setResponseMessage('Ошибка при обработке данных.');
      }
    } catch (error) {
      console.error('Ошибка отправки данных:', error);
      setResponseMessage('Произошла ошибка при отправке данных.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-xl rounded-lg w-full max-w-xl ml-7">
        <label className="block mb-4 text-sm font-semibold">
          Количество направлений:
          <input
            type="number"
            value={formData.top_n}
            onChange={(e) => setFormData({ ...formData, top_n: e.target.value })}
            className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />
        </label>

        <fieldset className="space-y-4 mb-6">
          <label className="block text-sm font-semibold">
            Пол:
            <select
              value={formData.gender}
              name="gender"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Выберите пол</option>
              <option value="М">Мужской</option>
              <option value="Ж">Женский</option>
            </select>
          </label>

          <label className="block text-sm font-semibold">
            Возраст:
            <input
              type="number"
              value={formData.age}
              name="age"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          <label className="block text-sm font-semibold">
            Вид спорта:
            <input
              type="text"
              value={formData.sport}
              name="sport"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          <label className="block text-sm font-semibold">
            Средний балл (GPA):
            <input
              type="number"
              step="0.01"
              value={formData.gpa}
              name="gpa"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          <label className="block text-sm font-semibold">
            Общее количество баллов:
            <input
              type="range"
              min="0"
              max="310"
              step="1"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
              className="w-full mt-2"
            />
            <span className="text-sm">{formData.points} баллов</span>
          </label>

          <label className="block text-sm font-semibold">
            Дополнительные баллы:
            <input
              type="number"
              value={formData.bonus_points}
              name="bonus_points"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          <label className="block text-sm font-semibold">
            Выберите экзамены:
            <div className="grid grid-cols-2 gap-2 mt-2">
              {egeExams.map((exam) => (
                <div
                  key={exam}
                  className={`p-2 border rounded-lg cursor-pointer ${ formData.exams.includes(exam) ? 'bg-purple-500 text-white' : 'bg-gray-200' }`}
                  onClick={() => handleExamClick(exam)}
                >
                  {exam}
                </div>
              ))}
            </div>
          </label>

          <label className="block text-sm font-semibold">
            Приоритет:
            <input
              type="number"
              value={formData.priority}
              name="priority"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </label>

          <label className="block text-sm font-semibold">
            Вид приема:
            <select
              value={formData.reception_form}
              name="reception_form"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Выберите вид приема</option>
              <option value="Общий конкурс">Общий конкурс</option>
              <option value="По договору">По договору</option>
            </select>
          </label>

          <label className="block text-sm font-semibold">
            Вид образования:
            <select
              value={formData.education}
              name="education"
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Выберите вид образования</option>
              <option value="Начальное общее образование">Начальное общее образование</option>
              <option value="Среднее общее образование">Среднее общее образование</option>
              <option value="Высшее общее образование">Высшее общее образование</option>
            </select>
          </label>
          Форма обучения:
          <input
            type="text"
            name="study_form"
            value={formData.study_form}
            onChange={handleChange}
          />
        <label className="block text-sm font-semibold">
            Форма обучения:
            <select
              name="study_form"
              value={formData.study_form}
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2focus:ring-purple-500"
              required
            >
              <option value="">Выберите форму обучения</option>
              <option value="Очная">Очная</option>
              <option value="Заочная">Заочная</option>
              <option value="Очно-заочная">Очно-заочная</option>
            </select>
          </label>
        </fieldset>

        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Рассчитать
        </button>
      </form>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-lg rounded-lg w-96">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Результаты</h3>
            </div>
            <div className="mt-4">
              {recommendations.length > 0 ? (
                <ul className="space-y-2">
                  {recommendations.map((item, index) => (
                    <li key={index} className="p-2 border rounded-lg bg-gray-100">
                      {item.replace('Направление подготовки_', '')}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Рекомендации отсутствуют.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;