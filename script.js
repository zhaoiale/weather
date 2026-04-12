// 配置模块
const Config = {
    API_KEY: '3fd512542df3df1514995b577b973328',
    API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
    DEFAULT_CITY: '北京',
    DEBOUNCE_DELAY: 300,
    HISTORY_MAX_ITEMS: 5
};

// 工具函数模块
const Utils = {
    // 防抖函数
    debounce(func, delay) {
        let timer;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, arguments), delay);
        };
    },
    
    // 格式化日期
    formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const weekday = weekdays[date.getDay()];
        return `${year}年${month}月${day}日 ${weekday}`;
    },
    
    // 格式化预报日期
    formatForecastDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekday = weekdays[date.getDay()];
        return `${month}/${day}<br>周${weekday}`;
    },
    
    // 格式化时间
    formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    },
    
    // 获取风向
    getWindDirection(deg) {
        const directions = ['北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风'];
        const index = Math.round(deg / 45) % 8;
        return directions[index];
    },
    
    // 温度单位转换
    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    },
    
    // 存储数据到本地存储
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error('本地存储错误:', err);
        }
    },
    
    // 从本地存储获取数据
    getLocalStorage(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (err) {
            console.error('本地存储错误:', err);
            return defaultValue;
        }
    }
};

// 中文城市到英文城市的映射
const CityMap = {
    '北京': 'Beijing',
    '上海': 'Shanghai',
    '广州': 'Guangzhou',
    '深圳': 'Shenzhen',
    '杭州': 'Hangzhou',
    '成都': 'Chengdu',
    '武汉': 'Wuhan',
    '西安': "Xi'an",
    '南京': 'Nanjing',
    '重庆': 'Chongqing',
    '天津': 'Tianjin',
    '苏州': 'Suzhou',
    '郑州': 'Zhengzhou',
    '长沙': 'Changsha',
    '青岛': 'Qingdao',
    '宁波': 'Ningbo',
    '厦门': 'Xiamen',
    '福州': 'Fuzhou',
    '济南': 'Jinan',
    '哈尔滨': 'Harbin',
    '沈阳': 'Shenyang',
    '大连': 'Dalian',
    '合肥': 'Hefei',
    '无锡': 'Wuxi',
    '佛山': 'Foshan',
    '东莞': 'Dongguan',
    '昆明': 'Kunming',
    '长春': 'Changchun',
    '石家庄': 'Shijiazhuang',
    '常州': 'Changzhou',
    '泉州': 'Quanzhou',
    '南宁': 'Nanning',
    '温州': 'Wenzhou',
    '南昌': 'Nanchang',
    '贵阳': 'Guiyang',
    '烟台': 'Yantai',
    '嘉兴': 'Jiaxing',
    '南通': 'Nantong',
    '金华': 'Jinhua',
    '惠州': 'Huizhou',
    '太原': 'Taiyuan',
    '徐州': 'Xuzhou',
    '绍兴': 'Shaoxing',
    '中山': 'Zhongshan',
    '台州': 'Taizhou',
    '潍坊': 'Weifang',
    '兰州': 'Lanzhou',
    '海口': 'Haikou',
    '扬州': 'Yangzhou',
    '汕头': 'Shantou',
    '保定': 'Baoding',
    '唐山': 'Tangshan',
    '镇江': 'Zhenjiang',
    '吉林': 'Jilin',
    '柳州': 'Liuzhou',
    '洛阳': 'Luoyang',
    '珠海': 'Zhuhai',
    '湛江': 'Zhanjiang',
    '宜昌': 'Yichang',
    '邯郸': 'Handan',
    '威海': 'Weihai',
    '咸阳': 'Xianyang',
    '芜湖': 'Wuhu',
    '呼和浩特': 'Hohhot',
    '乌鲁木齐': 'Urumqi',
    '西宁': 'Xining',
    '银川': 'Yinchuan',
    '拉萨': 'Lhasa',
    '澳门': 'Macau',
    '香港': 'Hong Kong',
    '台北': 'Taipei'
};

// 将中文城市名转换为英文
function getEnglishCityName(chineseName) {
    return CityMap[chineseName] || chineseName;
}

// 将英文城市名转换为中文
function getChineseCityName(englishName) {
    const lowerName = englishName.toLowerCase();
    for (const [chinese, english] of Object.entries(CityMap)) {
        if (english.toLowerCase() === lowerName) {
            return chinese;
        }
    }
    // 处理一些特殊情况（不同的拼写形式）
    const specialCases = {
        'xi an': '西安',
        "xi'an": '西安',
        'xian': '西安',
        'xiamen': '厦门',
        'hong kong': '香港',
        'hongkong': '香港',
        'macau': '澳门',
        'beijing': '北京',
        'shanghai': '上海',
        'guangzhou': '广州',
        'shenzhen': '深圳'
    };
    return specialCases[lowerName] || englishName;
}

// 天气API模块
const WeatherAPI = {
    // 获取当前天气
    async getCurrentWeather(city) {
        // 将中文城市名转换为英文用于API调用
        const englishCity = getEnglishCityName(city);
        const encodedCity = encodeURIComponent(englishCity) + ',CN';
        const url = `${Config.API_BASE_URL}/weather?q=${encodedCity}&appid=${Config.API_KEY}&units=metric&lang=zh_cn`;
        
        console.log('API请求URL:', url);
        
        try {
            const response = await fetch(url);
            console.log('API响应状态:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log('API错误数据:', errorData);
                throw new Error('城市不存在或API调用失败');
            }
            
            const data = await response.json();
            console.log('API响应数据:', data);
            // 将城市名设置为原始输入的中文名称
            data.name = city;
            return data;
        } catch (err) {
            console.error('获取当前天气错误:', err);
            throw err;
        }
    },
    
    // 获取天气预报
    async getForecast(city) {
        // 将中文城市名转换为英文用于API调用
        const englishCity = getEnglishCityName(city);
        const encodedCity = encodeURIComponent(englishCity) + ',CN';
        const url = `${Config.API_BASE_URL}/forecast?q=${encodedCity}&appid=${Config.API_KEY}&units=metric&lang=zh_cn`;
        
        console.log('预报API请求URL:', url);
        
        try {
            const response = await fetch(url);
            console.log('预报API响应状态:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log('预报API错误数据:', errorData);
                throw new Error(errorData.message || '获取预报失败');
            }
            
            const data = await response.json();
            console.log('预报API响应数据:', data);
            return data;
        } catch (err) {
            console.error('获取预报错误:', err);
            throw err;
        }
    },
    
    // 获取空气质量
    async getAirQuality(lat, lon) {
        const url = `${Config.API_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${Config.API_KEY}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('获取空气质量失败');
            }
            return await response.json();
        } catch (err) {
            console.error('获取空气质量错误:', err);
            return null; // 空气质量获取失败不影响主功能
        }
    },
    
    // 通过地理坐标获取城市天气
    async getWeatherByCoords(lat, lon) {
        const url = `${Config.API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${Config.API_KEY}&units=metric&lang=zh_cn`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('获取位置天气失败');
            }
            const data = await response.json();
            // 将英文城市名转换为中文
            data.name = getChineseCityName(data.name) || data.name;
            return data;
        } catch (err) {
            console.error('获取位置天气错误:', err);
            throw err;
        }
    },
    
    // 获取24小时预报
    async get24HourForecast(city) {
        const forecastData = await this.getForecast(city);
        // 提取24小时内的预报数据（每3小时一条，共8条）
        return forecastData.list.slice(0, 8);
    }
};

// UI模块
const UI = {
    elements: {
        searchInput: document.getElementById('searchInput'),
        searchBtn: document.getElementById('searchBtn'),
        suggestions: document.getElementById('suggestions'),
        loading: document.getElementById('loading'),
        error: document.getElementById('error'),
        errorMessage: document.getElementById('errorMessage'),
        retryBtn: document.getElementById('retryBtn'),
        weatherContent: document.getElementById('weatherContent'),
        themeToggle: document.getElementById('themeToggle'),
        cityName: document.getElementById('cityName'),
        date: document.getElementById('date'),
        currentTemp: document.getElementById('currentTemp'),
        weatherDesc: document.getElementById('weatherDesc'),
        humidity: document.getElementById('humidity'),
        windDirection: document.getElementById('windDirection'),
        windSpeed: document.getElementById('windSpeed'),
        feelsLike: document.getElementById('feelsLike'),
        weatherIcon: document.getElementById('weatherIcon'),
        forecastItems: document.getElementById('forecastItems'),
        hourlyItems: document.getElementById('hourlyItems'),
        historyList: null // 将在初始化时创建
    },
    
    // 显示加载状态
    showLoading() {
        this.elements.loading.style.display = 'flex';
        this.elements.error.style.display = 'none';
        this.elements.weatherContent.style.display = 'none';
    },
    
    // 显示错误信息
    showError(message) {
        this.elements.loading.style.display = 'none';
        this.elements.error.style.display = 'flex';
        this.elements.weatherContent.style.display = 'none';
        this.elements.errorMessage.textContent = message;
    },
    
    // 显示天气内容
    showWeatherContent() {
        this.elements.loading.style.display = 'none';
        this.elements.error.style.display = 'none';
        this.elements.weatherContent.style.display = 'block';
    },
    
    // 获取天气图标
    getWeatherIcon(weatherId) {
        if (weatherId >= 200 && weatherId < 300) {
            return 'fas fa-bolt'; // 雷暴
        } else if (weatherId >= 300 && weatherId < 400) {
            return 'fas fa-cloud-rain'; // 毛毛雨
        } else if (weatherId >= 500 && weatherId < 600) {
            return 'fas fa-cloud-showers-heavy'; // 雨
        } else if (weatherId >= 600 && weatherId < 700) {
            return 'fas fa-snowflake'; // 雪
        } else if (weatherId >= 700 && weatherId < 800) {
            return 'fas fa-smog'; // 雾
        } else if (weatherId === 800) {
            return 'fas fa-sun'; // 晴天
        } else if (weatherId > 800) {
            return 'fas fa-cloud'; // 多云
        }
        return 'fas fa-cloud'; // 默认
    },
    
    // 显示搜索建议
    showSuggestions(cities) {
        if (!cities || cities.length === 0) {
            this.elements.suggestions.innerHTML = '';
            this.elements.suggestions.style.display = 'none';
            return;
        }
        
        this.elements.suggestions.innerHTML = cities.map(city => 
            `<div class="suggestion-item" data-city="${city}">${city}</div>`
        ).join('');
        this.elements.suggestions.style.display = 'block';
    },
    
    // 隐藏搜索建议
    hideSuggestions() {
        this.elements.suggestions.innerHTML = '';
        this.elements.suggestions.style.display = 'none';
    },
    
    // 设置天气效果
    setWeatherEffect(weatherId) {
        console.log('天气ID:', weatherId);
        
        // 移除所有天气效果类
        document.body.classList.remove(
            'weather-sunny', 'weather-cloudy', 'weather-rainy', 
            'weather-snowy', 'weather-thunderstorm', 'weather-fog'
        );
        
        let weatherClass = '';
        
        // 根据天气ID设置效果
        if (weatherId === 800) {
            // 晴天
            weatherClass = 'weather-sunny';
        } else if (weatherId > 800 && weatherId < 900) {
            // 多云
            weatherClass = 'weather-cloudy';
        } else if (weatherId >= 200 && weatherId < 300) {
            // 雷暴
            weatherClass = 'weather-thunderstorm';
        } else if ((weatherId >= 500 && weatherId < 600) || (weatherId >= 300 && weatherId < 400)) {
            // 雨
            weatherClass = 'weather-rainy';
        } else if (weatherId >= 600 && weatherId < 700) {
            // 雪
            weatherClass = 'weather-snowy';
        } else if (weatherId >= 700 && weatherId < 800) {
            // 雾
            weatherClass = 'weather-fog';
        }
        
        if (weatherClass) {
            document.body.classList.add(weatherClass);
            console.log('添加天气类:', weatherClass);
        } else {
            console.log('未找到对应天气类');
        }
        
        console.log('当前body类:', document.body.className);
    },
    
    // 显示天气数据
    displayWeather(currentWeather, forecastData, airQuality = null) {
        // 设置天气效果
        this.setWeatherEffect(currentWeather.weather[0].id);
        
        // 当前天气
        this.elements.cityName.textContent = currentWeather.name;
        this.elements.date.textContent = Utils.formatDate(currentWeather.dt);
        this.elements.currentTemp.textContent = Math.round(currentWeather.main.temp);
        this.elements.weatherDesc.textContent = currentWeather.weather[0].description;
        this.elements.humidity.textContent = `${currentWeather.main.humidity}%`;
        this.elements.windDirection.textContent = Utils.getWindDirection(currentWeather.wind.deg);
        this.elements.windSpeed.textContent = `${Math.round(currentWeather.wind.speed)}m/s`;
        this.elements.feelsLike.textContent = `${Math.round(currentWeather.main.feels_like)}°C`;
        
        // 更新天气图标
        const weatherIcon = this.elements.weatherIcon.querySelector('i');
        weatherIcon.className = this.getWeatherIcon(currentWeather.weather[0].id);
        
        // 显示日出日落时间
        this.displaySunriseSunset(currentWeather.sys.sunrise, currentWeather.sys.sunset);
        
        // 显示空气质量
        if (airQuality) {
            this.displayAirQuality(airQuality);
        }
        
        // 显示气压
        this.displayPressure(currentWeather.main.pressure);
        
        // 显示能见度
        this.displayVisibility(currentWeather.visibility);
        
        // 计算并显示降水概率（基于预报数据）
        const precipitationProb = this.calculatePrecipitationProbability(forecastData);
        this.displayPrecipitationProbability(precipitationProb);
        
        // 未来几天预报
        this.displayForecast(forecastData);
    },
    
    // 计算降水概率
    calculatePrecipitationProbability(forecastData) {
        if (!forecastData || !forecastData.list) return 0;
        
        // 计算未来24小时内有降水的概率
        let rainyHours = 0;
        const totalHours = 8; // 24小时预报有8个时段
        
        forecastData.list.slice(0, 8).forEach(item => {
            const weatherId = item.weather[0].id;
            // 检测是否有降水（雨、雪等）
            if (weatherId >= 200 && weatherId < 700) {
                rainyHours++;
            }
        });
        
        return Math.round((rainyHours / totalHours) * 100);
    },
    
    // 显示日出日落时间
    displaySunriseSunset(sunrise, sunset) {
        // 检查是否已存在日出日落元素
        let sunriseElement = document.getElementById('sunrise');
        let sunsetElement = document.getElementById('sunset');
        
        if (!sunriseElement || !sunsetElement) {
            // 创建新元素
            const detailsContainer = document.querySelector('.details');
            
            const sunriseItem = document.createElement('div');
            sunriseItem.className = 'detail-item';
            sunriseItem.id = 'sunrise';
            sunriseItem.innerHTML = `
                <i class="fas fa-sunrise"></i>
                <span>日出</span>
                <span id="sunriseTime">${Utils.formatTime(sunrise)}</span>
            `;
            
            const sunsetItem = document.createElement('div');
            sunsetItem.className = 'detail-item';
            sunsetItem.id = 'sunset';
            sunsetItem.innerHTML = `
                <i class="fas fa-sunset"></i>
                <span>日落</span>
                <span id="sunsetTime">${Utils.formatTime(sunset)}</span>
            `;
            
            detailsContainer.appendChild(sunriseItem);
            detailsContainer.appendChild(sunsetItem);
        } else {
            // 更新现有元素
            document.getElementById('sunriseTime').textContent = Utils.formatTime(sunrise);
            document.getElementById('sunsetTime').textContent = Utils.formatTime(sunset);
        }
    },
    
    // 显示空气质量
    displayAirQuality(airQuality) {
        // 检查是否已存在空气质量元素
        let airQualityElement = document.getElementById('airQuality');
        
        if (!airQualityElement) {
            // 创建新元素
            const detailsContainer = document.querySelector('.details');
            
            const aqiItem = document.createElement('div');
            aqiItem.className = 'detail-item';
            aqiItem.id = 'airQuality';
            
            const aqi = airQuality.list[0].main.aqi;
            const aqiText = this.getAQIText(aqi);
            const aqiColor = this.getAQIColor(aqi);
            
            aqiItem.innerHTML = `
                <i class="fas fa-wind" style="color: ${aqiColor};"></i>
                <span>空气质量</span>
                <span id="aqiValue" style="color: ${aqiColor};">${aqiText}</span>
            `;
            
            detailsContainer.appendChild(aqiItem);
        } else {
            // 更新现有元素
            const aqi = airQuality.list[0].main.aqi;
            const aqiText = this.getAQIText(aqi);
            const aqiColor = this.getAQIColor(aqi);
            
            const aqiIcon = airQualityElement.querySelector('i');
            const aqiValue = document.getElementById('aqiValue');
            
            aqiIcon.style.color = aqiColor;
            aqiValue.textContent = aqiText;
            aqiValue.style.color = aqiColor;
        }
    },
    
    // 获取空气质量文本
    getAQIText(aqi) {
        const aqiLevels = ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'];
        return aqiLevels[aqi - 1] || '未知';
    },
    
    // 获取空气质量颜色
    getAQIColor(aqi) {
        const colors = ['#00e400', '#ffff00', '#ff7e00', '#ff0000', '#8f3f97', '#7e0023'];
        return colors[aqi - 1] || '#999';
    },
    
    // 显示气压
    displayPressure(pressure) {
        let pressureElement = document.getElementById('pressure');
        
        if (!pressureElement) {
            const detailsContainer = document.querySelector('.details');
            pressureElement = document.createElement('div');
            pressureElement.className = 'detail-item';
            pressureElement.id = 'pressure';
            detailsContainer.appendChild(pressureElement);
        }
        
        pressureElement.innerHTML = `
            <i class="fas fa-thermometer"></i>
            <span>气压</span>
            <span>${pressure} hPa</span>
        `;
    },
    
    // 显示能见度
    displayVisibility(visibility) {
        let visibilityElement = document.getElementById('visibility');
        
        if (!visibilityElement) {
            const detailsContainer = document.querySelector('.details');
            visibilityElement = document.createElement('div');
            visibilityElement.className = 'detail-item';
            visibilityElement.id = 'visibility';
            detailsContainer.appendChild(visibilityElement);
        }
        
        const km = (visibility / 1000).toFixed(1);
        visibilityElement.innerHTML = `
            <i class="fas fa-eye"></i>
            <span>能见度</span>
            <span>${km} km</span>
        `;
    },
    
    // 显示降水概率
    displayPrecipitationProbability(probability) {
        let precipElement = document.getElementById('precipitation');
        
        if (!precipElement) {
            const detailsContainer = document.querySelector('.details');
            precipElement = document.createElement('div');
            precipElement.className = 'detail-item';
            precipElement.id = 'precipitation';
            detailsContainer.appendChild(precipElement);
        }
        
        const color = probability > 70 ? '#ff0000' : probability > 40 ? '#ff7e00' : '#00e400';
        precipElement.innerHTML = `
            <i class="fas fa-cloud-rain" style="color: ${color};"></i>
            <span>降水概率</span>
            <span style="color: ${color};">${probability}%</span>
        `;
    },
    
    // 显示24小时预报
    displayHourlyForecast(hourlyData) {
        this.elements.hourlyItems.innerHTML = '';
        
        hourlyData.forEach((item, index) => {
            const date = new Date(item.dt * 1000);
            const timeStr = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
            
            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';
            
            hourlyItem.innerHTML = `
                <div class="hourly-time">${timeStr}</div>
                <div class="hourly-icon">
                    <i class="${this.getWeatherIcon(item.weather[0].id)}"></i>
                </div>
                <div class="hourly-temp">${Math.round(item.main.temp)}°C</div>
            `;
            
            this.elements.hourlyItems.appendChild(hourlyItem);
        });
    },
    
    // 显示预报
    displayForecast(forecastData) {
        this.elements.forecastItems.innerHTML = '';
        
        // 每8小时一个预报，取每天的第一个预报
        for (let i = 0; i < 5; i++) {
            const forecast = forecastData.list[i * 8];
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="forecast-date">${Utils.formatForecastDate(forecast.dt)}</div>
                <div class="forecast-icon">
                    <i class="${this.getWeatherIcon(forecast.weather[0].id)}"></i>
                </div>
                <div class="forecast-desc">${forecast.weather[0].description}</div>
                <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
            `;
            this.elements.forecastItems.appendChild(forecastItem);
        }
    },
    
    // 初始化主题
    initTheme() {
        const savedTheme = Utils.getLocalStorage('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', initialTheme);
        this.updateThemeIcon(initialTheme);
    },
    
    // 更新主题图标
    updateThemeIcon(theme) {
        const icon = this.elements.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    },
    
    // 切换主题
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        Utils.setLocalStorage('theme', newTheme);
        this.updateThemeIcon(newTheme);
    },
    
    // 初始化历史记录UI
    initHistoryUI() {
        // 检查是否已存在历史记录容器
        let historyContainer = document.querySelector('.history-section');
        if (!historyContainer) {
            // 创建历史记录容器
            const main = document.querySelector('.main');
            const searchSection = document.querySelector('.search-section');
            
            historyContainer = document.createElement('section');
            historyContainer.className = 'history-section';
            historyContainer.innerHTML = `
                <h3>搜索历史</h3>
                <div class="history-list" id="historyList"></div>
            `;
            
            // 插入到搜索区域下方
            main.insertBefore(historyContainer, searchSection.nextSibling);
        }
        
        this.elements.historyList = document.getElementById('historyList');
        this.updateHistoryUI();
    },
    
    // 更新历史记录UI
    updateHistoryUI() {
        if (!this.elements.historyList) return;
        
        const history = WeatherApp.getSearchHistory();
        if (history.length === 0) {
            this.elements.historyList.innerHTML = '<p class="no-history">暂无搜索历史</p>';
            return;
        }
        
        this.elements.historyList.innerHTML = history.map(city => 
            `<div class="history-item" data-city="${city}">
                <span>${city}</span>
                <button class="history-remove" data-city="${city}">
                    <i class="fas fa-times"></i>
                </button>
            </div>`
        ).join('');
    },
    
    // 初始化收藏UI
    initFavoriteUI() {
        let favoriteContainer = document.querySelector('.favorite-section');
        if (!favoriteContainer) {
            const main = document.querySelector('.main');
            const searchSection = document.querySelector('.search-section');
            
            favoriteContainer = document.createElement('section');
            favoriteContainer.className = 'favorite-section';
            favoriteContainer.innerHTML = `
                <div class="section-header">
                    <h3>收藏城市</h3>
                    <span class="section-subtitle">点击城市快速切换</span>
                </div>
                <div class="favorite-list" id="favoriteList"></div>
            `;
            
            main.insertBefore(favoriteContainer, searchSection.nextSibling);
        }
        
        this.elements.favoriteList = document.getElementById('favoriteList');
        this.updateFavoriteUI();
    },
    
    // 更新收藏UI
    updateFavoriteUI() {
        if (!this.elements.favoriteList) return;
        
        const favorites = WeatherApp.getFavoriteCities();
        const defaultCity = WeatherApp.getDefaultCity();
        
        if (favorites.length === 0) {
            this.elements.favoriteList.innerHTML = '<p class="no-favorite">暂无收藏城市</p>';
            return;
        }
        
        this.elements.favoriteList.innerHTML = favorites.map(city => {
            const isDefault = city === defaultCity;
            return `
                <div class="favorite-item" data-city="${city}">
                    <span>${city}</span>
                    <div class="favorite-actions">
                        <button class="favorite-set-default" data-city="${city}" title="${isDefault ? '已设为默认' : '设为默认'}">
                            <i class="fas ${isDefault ? 'fa-star' : 'fa-star-o'}"></i>
                        </button>
                        <button class="favorite-remove" data-city="${city}" title="取消收藏">
                            <i class="fas fa-heart-broken"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // 更新默认城市指示器
    updateDefaultCityIndicator(city) {
        const favoriteItems = document.querySelectorAll('.favorite-item');
        favoriteItems.forEach(item => {
            const itemCity = item.getAttribute('data-city');
            const starIcon = item.querySelector('.favorite-set-default i');
            if (itemCity === city) {
                starIcon.className = 'fas fa-star';
            } else {
                starIcon.className = 'fas fa-star-o';
            }
        });
    },
    
    // 更新当前城市的收藏按钮状态
    updateCurrentCityFavoriteButton(city) {
        const favBtn = document.querySelector('.favorite-btn');
        if (favBtn) {
            const isFav = WeatherApp.isFavorite(city);
            const icon = favBtn.querySelector('i');
            icon.className = isFav ? 'fas fa-heart' : 'far fa-heart';
            favBtn.title = isFav ? '取消收藏' : '添加收藏';
        }
    },
    
    // 创建当前城市的收藏按钮
    createFavoriteButton(city) {
        let favBtn = document.querySelector('.favorite-btn');
        if (!favBtn) {
            const locationDiv = document.querySelector('.location');
            favBtn = document.createElement('button');
            favBtn.className = 'favorite-btn';
            favBtn.innerHTML = '<i class="far fa-heart"></i>';
            favBtn.title = '添加收藏';
            locationDiv.appendChild(favBtn);
        }
        
        this.updateCurrentCityFavoriteButton(city);
    },
    
    // 创建分享按钮
    createShareButtons() {
        let shareContainer = document.querySelector('.share-container');
        if (!shareContainer) {
            const weatherInfo = document.querySelector('.weather-info');
            shareContainer = document.createElement('div');
            shareContainer.className = 'share-container';
            shareContainer.innerHTML = `
                <button class="share-btn" id="shareBtn" title="分享天气">
                    <i class="fas fa-share-alt"></i>
                </button>
                <div class="share-menu" id="shareMenu">
                    <button class="share-option" data-platform="wechat">
                        <i class="fab fa-weixin"></i>
                        <span>微信</span>
                    </button>
                    <button class="share-option" data-platform="weibo">
                        <i class="fab fa-weibo"></i>
                        <span>微博</span>
                    </button>
                    <button class="share-option" data-platform="qq">
                        <i class="fab fa-qq"></i>
                        <span>QQ</span>
                    </button>
                    <button class="share-option" data-platform="copy">
                        <i class="fas fa-copy"></i>
                        <span>复制链接</span>
                    </button>
                    <button class="share-option" data-platform="image">
                        <i class="fas fa-image"></i>
                        <span>生成图片</span>
                    </button>
                </div>
            `;
            weatherInfo.appendChild(shareContainer);
        }
    },
    
    // 显示分享菜单
    showShareMenu() {
        const shareMenu = document.getElementById('shareMenu');
        if (shareMenu) {
            shareMenu.style.display = 'flex';
        }
    },
    
    // 隐藏分享菜单
    hideShareMenu() {
        const shareMenu = document.getElementById('shareMenu');
        if (shareMenu) {
            shareMenu.style.display = 'none';
        }
    },
    
    // 生成分享文本
    generateShareText() {
        const city = UI.elements.cityName.textContent;
        const temp = UI.elements.currentTemp.textContent;
        const desc = UI.elements.weatherDesc.textContent;
        
        return `${city}天气：${desc}，${temp}°C - 极简天气`;
    },
    
    // 复制链接到剪贴板
    async copyLink() {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            this.showToast('链接已复制');
        } catch (err) {
            console.error('复制失败:', err);
            this.showToast('复制失败');
        }
    },
    
    // 生成天气卡片图片
    generateWeatherCard() {
        const weatherContent = document.querySelector('.weather-content');
        
        // 创建canvas来生成图片
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置canvas尺寸
        const width = 400;
        const height = 500;
        canvas.width = width;
        canvas.height = height;
        
        // 创建渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#4361ee');
        gradient.addColorStop(1, '#3a0ca3');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 获取天气数据
        const city = UI.elements.cityName.textContent;
        const date = UI.elements.date.textContent;
        const temp = UI.elements.currentTemp.textContent;
        const desc = UI.elements.weatherDesc.textContent;
        const humidity = UI.elements.humidity.textContent;
        const windSpeed = UI.elements.windSpeed.textContent;
        
        // 绘制城市名称
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(city, width / 2, 60);
        
        // 绘制日期
        ctx.font = '16px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(date, width / 2, 90);
        
        // 绘制温度
        ctx.font = 'bold 64px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText(`${temp}°C`, width / 2, 180);
        
        // 绘制天气描述
        ctx.font = '24px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(desc, width / 2, 230);
        
        // 绘制分隔线
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(50, 270);
        ctx.lineTo(width - 50, 270);
        ctx.stroke();
        
        // 绘制详细信息
        ctx.font = '16px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        ctx.fillText(`湿度: ${humidity}`, 100, 320);
        ctx.fillText(`风速: ${windSpeed}`, width - 100, 320);
        
        // 绘制底部装饰
        ctx.font = '14px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText('极简天气', width / 2, height - 30);
        
        // 创建下载链接
        const link = document.createElement('a');
        link.download = `${city}-weather.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    },
    
    // 显示提示
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }
};

// 天气应用主模块
const WeatherApp = {
    // 城市列表（用于搜索提示）
    cities: [
        '北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆',
        '天津', '苏州', '郑州', '长沙', '青岛', '宁波', '厦门', '福州', '济南', '哈尔滨'
    ],
    
    // 测试API连接
    async testAPIConnection() {
        try {
            const url = `${Config.API_BASE_URL}/weather?q=Beijing,CN&appid=${Config.API_KEY}&units=metric&lang=zh_cn`;
            console.log('测试API连接:', url);
            
            const response = await fetch(url);
            console.log('API测试响应状态:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('API测试成功:', data);
                return true;
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.log('API测试失败:', errorData);
                return false;
            }
        } catch (err) {
            console.error('API测试错误:', err);
            return false;
        }
    },
    
    // 初始化应用
    async init() {
        this.initEventListeners();
        UI.initTheme();
        UI.initFavoriteUI();
        UI.initHistoryUI();
        
        // 测试API连接
        const apiConnected = await this.testAPIConnection();
        if (apiConnected) {
            console.log('API连接正常，加载默认天气');
            this.loadDefaultWeather();
        } else {
            console.log('API连接失败，请检查API密钥');
            UI.showError('API连接失败，请检查API密钥是否正确');
        }
    },
    
    // 初始化事件监听器
    initEventListeners() {
        // 主题切换
        UI.elements.themeToggle.addEventListener('click', () => UI.toggleTheme());
        
        // 搜索输入（带防抖）
        UI.elements.searchInput.addEventListener('input', Utils.debounce((e) => {
            this.handleSearchInput(e.target.value);
        }, Config.DEBOUNCE_DELAY));
        
        // 搜索按钮
        UI.elements.searchBtn.addEventListener('click', () => {
            const city = UI.elements.searchInput.value.trim();
            if (city) {
                this.searchCity(city);
            }
        });
        
        // 回车键搜索
        UI.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const city = UI.elements.searchInput.value.trim();
                if (city) {
                    this.searchCity(city);
                }
            }
        });
        
        // 点击搜索建议
        UI.elements.suggestions.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-item')) {
                const city = e.target.getAttribute('data-city');
                this.selectCity(city);
            }
        });
        
        // 点击页面其他地方关闭搜索建议
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                UI.hideSuggestions();
            }
        });
        
        // 重试按钮
        UI.elements.retryBtn.addEventListener('click', () => {
            const city = UI.elements.searchInput.value.trim() || Config.DEFAULT_CITY;
            this.searchCity(city);
        });
        
        // 历史记录点击
        document.addEventListener('click', (e) => {
            if (e.target.closest('.history-item')) {
                const city = e.target.closest('.history-item').getAttribute('data-city');
                this.selectCity(city);
            }
        });
        
        // 历史记录删除
        document.addEventListener('click', (e) => {
            if (e.target.closest('.history-remove')) {
                e.stopPropagation();
                const city = e.target.closest('.history-remove').getAttribute('data-city');
                this.removeFromHistory(city);
            }
        });
        
        // 收藏按钮点击
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn')) {
                const city = UI.elements.cityName.textContent;
                const isFavorited = this.toggleFavorite(city);
                UI.updateCurrentCityFavoriteButton(city);
                
                // 显示提示
                const toast = document.createElement('div');
                toast.className = 'toast';
                toast.textContent = isFavorited ? '已添加到收藏' : '已取消收藏';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            }
        });
        
        // 收藏城市点击
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-item') && !e.target.closest('.favorite-actions')) {
                const city = e.target.closest('.favorite-item').getAttribute('data-city');
                this.selectCity(city);
            }
        });
        
        // 取消收藏
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-remove')) {
                e.stopPropagation();
                const city = e.target.closest('.favorite-remove').getAttribute('data-city');
                this.removeFromFavorites(city);
            }
        });
        
        // 设置默认城市
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-set-default')) {
                e.stopPropagation();
                const city = e.target.closest('.favorite-set-default').getAttribute('data-city');
                this.setDefaultCity(city);
                
                const toast = document.createElement('div');
                toast.className = 'toast';
                toast.textContent = `已将${city}设为默认城市`;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            }
        });
        
        // 分享按钮点击
        document.addEventListener('click', (e) => {
            if (e.target.closest('.share-btn')) {
                e.stopPropagation();
                const shareMenu = document.getElementById('shareMenu');
                const isVisible = shareMenu.style.display === 'flex';
                UI.hideShareMenu();
                if (!isVisible) {
                    UI.showShareMenu();
                }
            }
        });
        
        // 分享选项点击
        document.addEventListener('click', (e) => {
            if (e.target.closest('.share-option')) {
                e.stopPropagation();
                const platform = e.target.closest('.share-option').getAttribute('data-platform');
                this.handleShare(platform);
                UI.hideShareMenu();
            }
        });
        
        // 点击其他地方关闭分享菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.share-container')) {
                UI.hideShareMenu();
            }
        });
        
        // 定位按钮（稍后添加）
        this.initLocationButton();
    },
    
    // 处理分享
    handleShare(platform) {
        const shareText = UI.generateShareText();
        const url = window.location.href;
        
        switch (platform) {
            case 'wechat':
                // 微信分享（提示用户复制链接到微信）
                this.copyLink();
                UI.showToast('请在微信中粘贴分享');
                break;
            case 'weibo':
                // 微博分享
                const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareText)}`;
                window.open(weiboUrl, '_blank');
                break;
            case 'qq':
                // QQ分享
                const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareText)}`;
                window.open(qqUrl, '_blank');
                break;
            case 'copy':
                // 复制链接
                UI.copyLink();
                break;
            case 'image':
                // 生成图片
                UI.generateWeatherCard();
                break;
        }
    },
    
    // 复制链接
    copyLink() {
        UI.copyLink();
    },
    
    // 初始化定位按钮
    initLocationButton() {
        // 检查是否已存在定位按钮
        let locationBtn = document.querySelector('.location-btn');
        if (!locationBtn) {
            // 创建定位按钮
            const searchContainer = document.querySelector('.search-container');
            
            locationBtn = document.createElement('button');
            locationBtn.className = 'location-btn';
            locationBtn.title = '使用当前位置';
            locationBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i>';
            
            // 添加到搜索容器
            searchContainer.appendChild(locationBtn);
        }
        
        // 添加点击事件
        locationBtn.addEventListener('click', () => {
            this.getLocationWeather();
        });
    },
    
    // 处理搜索输入
    handleSearchInput(query) {
        if (!query) {
            UI.hideSuggestions();
            return;
        }
        
        const filteredCities = this.cities.filter(city => 
            city.toLowerCase().includes(query.toLowerCase())
        );
        
        UI.showSuggestions(filteredCities);
    },
    
    // 选择城市
    selectCity(city) {
        // 将可能的英文城市名转换为中文
        const chineseCity = getChineseCityName(city);
        UI.elements.searchInput.value = chineseCity;
        UI.hideSuggestions();
        this.searchCity(chineseCity);
    },
    
    // 搜索城市
    async searchCity(city) {
        UI.showLoading();
        
        try {
            // 获取当前天气
            const currentWeather = await WeatherAPI.getCurrentWeather(city);
            console.log('API返回的天气数据:', currentWeather);
            console.log('天气ID:', currentWeather.weather[0].id);
            console.log('天气描述:', currentWeather.weather[0].description);
            
            // 获取预报
            const forecastData = await WeatherAPI.getForecast(city);
            
            // 获取24小时预报
            const hourlyForecastData = await WeatherAPI.get24HourForecast(city);
            
            // 获取空气质量
            const airQuality = await WeatherAPI.getAirQuality(
                currentWeather.coord.lat,
                currentWeather.coord.lon
            );
            
            // 显示天气数据
            UI.displayWeather(currentWeather, forecastData, airQuality);
            UI.displayHourlyForecast(hourlyForecastData);
            UI.showWeatherContent();
            
            // 创建收藏按钮
            UI.createFavoriteButton(city);
            
            // 创建分享按钮
            UI.createShareButtons();
            
            // 添加到搜索历史
            this.addToSearchHistory(city);
            
        } catch (err) {
            UI.showError(err.message || '网络异常，请稍后重试');
        }
    },
    
    // 加载默认天气
    async loadDefaultWeather() {
        try {
            const defaultCity = this.getDefaultCity();
            await this.searchCity(defaultCity);
        } catch (err) {
            console.error('加载默认天气失败:', err);
            // 显示默认天气数据
            this.showDefaultWeather();
        }
    },
    
    // 显示默认天气数据（当API连接失败时）
    showDefaultWeather() {
        // 默认天气数据
        const defaultWeather = {
            name: '北京',
            dt: Math.floor(Date.now() / 1000),
            main: {
                temp: 20,
                humidity: 50,
                feels_like: 18
            },
            weather: [{
                id: 800,
                description: '晴'
            }],
            wind: {
                deg: 180,
                speed: 3
            },
            sys: {
                sunrise: Math.floor((Date.now() - 43200000) / 1000), // 6小时前
                sunset: Math.floor((Date.now() + 21600000) / 1000) // 6小时后
            },
            coord: {
                lat: 39.9042,
                lon: 116.4074
            }
        };
        
        // 默认24小时预报数据
        const defaultHourlyForecast = [];
        for (let i = 0; i < 8; i++) {
            defaultHourlyForecast.push({
                dt: Math.floor((Date.now() + i * 3600000) / 1000), // 每3小时
                main: {
                    temp: 20 + Math.sin(i) * 2
                },
                weather: [{
                    id: 800,
                    description: '晴'
                }]
            });
        }
        
        // 默认预报数据
        const defaultForecast = {
            list: []
        };
        for (let i = 0; i < 5; i++) {
            defaultForecast.list.push({
                dt: Math.floor((Date.now() + i * 86400000) / 1000), // 每天
                main: {
                    temp: 20 + Math.sin(i) * 3
                },
                weather: [{
                    id: 800 + i % 4 * 100,
                    description: ['晴', '多云', '小雨', '阴'][i % 4]
                }]
            });
        }
        
        // 显示默认天气数据
        UI.displayWeather(defaultWeather, defaultForecast);
        UI.displayHourlyForecast(defaultHourlyForecast);
        UI.showWeatherContent();
        
        // 显示API连接失败的提示
        setTimeout(() => {
            UI.showError('API连接失败，显示默认天气数据');
        }, 1000);
    },
    
    // 获取位置天气
    getLocationWeather() {
        if (!navigator.geolocation) {
            UI.showError('您的浏览器不支持地理位置功能');
            return;
        }
        
        UI.showLoading();
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    
                    // 获取位置天气
                    const currentWeather = await WeatherAPI.getWeatherByCoords(latitude, longitude);
                    
                    // 获取预报
                    const forecastData = await WeatherAPI.getForecast(currentWeather.name);
                    
                    // 获取24小时预报
                    const hourlyForecastData = await WeatherAPI.get24HourForecast(currentWeather.name);
                    
                    // 获取空气质量
                    const airQuality = await WeatherAPI.getAirQuality(latitude, longitude);
                    
                    // 显示天气数据
                    UI.displayWeather(currentWeather, forecastData, airQuality);
                    UI.displayHourlyForecast(hourlyForecastData);
                    UI.showWeatherContent();
                    
                    // 更新搜索框
                    UI.elements.searchInput.value = currentWeather.name;
                    
                    // 添加到搜索历史
                    this.addToSearchHistory(currentWeather.name);
                    
                } catch (err) {
                    UI.showError(err.message || '获取位置天气失败');
                }
            },
            (error) => {
                let errorMessage = '获取位置失败';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = '用户拒绝了地理位置请求';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = '位置信息不可用';
                        break;
                    case error.TIMEOUT:
                        errorMessage = '获取位置超时';
                        break;
                }
                UI.showError(errorMessage);
            }
        );
    },
    
    // 获取搜索历史
    getSearchHistory() {
        return Utils.getLocalStorage('searchHistory', []);
    },
    
    // 添加到搜索历史
    addToSearchHistory(city) {
        let history = this.getSearchHistory();
        
        // 移除已存在的相同城市
        history = history.filter(item => item !== city);
        
        // 添加到开头
        history.unshift(city);
        
        // 限制历史记录数量
        if (history.length > Config.HISTORY_MAX_ITEMS) {
            history = history.slice(0, Config.HISTORY_MAX_ITEMS);
        }
        
        // 保存到本地存储
        Utils.setLocalStorage('searchHistory', history);
        
        // 更新UI
        UI.updateHistoryUI();
    },
    
    // 从历史记录中移除
    removeFromHistory(city) {
        let history = this.getSearchHistory();
        history = history.filter(item => item !== city);
        Utils.setLocalStorage('searchHistory', history);
        UI.updateHistoryUI();
    },
    
    // 获取收藏城市列表
    getFavoriteCities() {
        return Utils.getLocalStorage('favoriteCities', []);
    },
    
    // 添加到收藏
    addToFavorites(city) {
        let favorites = this.getFavoriteCities();
        if (!favorites.includes(city)) {
            favorites.push(city);
            Utils.setLocalStorage('favoriteCities', favorites);
        }
        UI.updateFavoriteUI();
    },
    
    // 从收藏中移除
    removeFromFavorites(city) {
        let favorites = this.getFavoriteCities();
        favorites = favorites.filter(item => item !== city);
        Utils.setLocalStorage('favoriteCities', favorites);
        UI.updateFavoriteUI();
    },
    
    // 切换收藏状态
    toggleFavorite(city) {
        const favorites = this.getFavoriteCities();
        if (favorites.includes(city)) {
            this.removeFromFavorites(city);
            return false;
        } else {
            this.addToFavorites(city);
            return true;
        }
    },
    
    // 检查城市是否已收藏
    isFavorite(city) {
        return this.getFavoriteCities().includes(city);
    },
    
    // 获取默认城市
    getDefaultCity() {
        return Utils.getLocalStorage('defaultCity', Config.DEFAULT_CITY);
    },
    
    // 设置默认城市
    setDefaultCity(city) {
        Utils.setLocalStorage('defaultCity', city);
        UI.updateDefaultCityIndicator(city);
    }
};

// 启动应用
WeatherApp.init();