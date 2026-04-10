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

// 天气API模块
const WeatherAPI = {
    // 获取当前天气
    async getCurrentWeather(city) {
        // 使用英文城市名称
        const cityName = WeatherApp.cityMap[city] || city;
        const encodedCity = encodeURIComponent(cityName) + ',CN';
        const url = `${Config.API_BASE_URL}/weather?q=${encodedCity}&appid=${Config.API_KEY}&units=metric&lang=zh_cn`;
        
        console.log('API请求URL:', url);
        
        try {
            const response = await fetch(url);
            console.log('API响应状态:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log('API错误数据:', errorData);
                throw new Error(errorData.message || '城市不存在或API调用失败');
            }
            
            const data = await response.json();
            console.log('API响应数据:', data);
            return data;
        } catch (err) {
            console.error('获取当前天气错误:', err);
            throw err;
        }
    },
    
    // 获取天气预报
    async getForecast(city) {
        // 使用英文城市名称
        const cityName = WeatherApp.cityMap[city] || city;
        const encodedCity = encodeURIComponent(cityName) + ',CN';
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
            return await response.json();
        } catch (err) {
            console.error('获取位置天气错误:', err);
            throw err;
        }
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
        
        // 未来几天预报
        this.displayForecast(forecastData);
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
    }
};

// 天气应用主模块
const WeatherApp = {
    // 城市列表（用于搜索提示）
    cities: [
        '北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆',
        '天津', '苏州', '郑州', '长沙', '青岛', '宁波', '厦门', '福州', '济南', '哈尔滨'
    ],
    
    // 中文城市到英文城市的映射
    cityMap: {
        '北京': 'Beijing',
        '上海': 'Shanghai',
        '广州': 'Guangzhou',
        '深圳': 'Shenzhen',
        '杭州': 'Hangzhou',
        '成都': 'Chengdu',
        '武汉': 'Wuhan',
        '西安': 'Xian',
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
        '哈尔滨': 'Harbin'
    },
    
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
        
        // 定位按钮（稍后添加）
        this.initLocationButton();
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
        UI.elements.searchInput.value = city;
        UI.hideSuggestions();
        this.searchCity(city);
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
            
            // 获取空气质量
            const airQuality = await WeatherAPI.getAirQuality(
                currentWeather.coord.lat,
                currentWeather.coord.lon
            );
            
            // 显示天气数据
            UI.displayWeather(currentWeather, forecastData, airQuality);
            UI.showWeatherContent();
            
            // 添加到搜索历史
            this.addToSearchHistory(city);
            
        } catch (err) {
            UI.showError(err.message || '网络异常，请稍后重试');
        }
    },
    
    // 加载默认天气
    async loadDefaultWeather() {
        await this.searchCity(Config.DEFAULT_CITY);
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
                    
                    // 获取空气质量
                    const airQuality = await WeatherAPI.getAirQuality(latitude, longitude);
                    
                    // 显示天气数据
                    UI.displayWeather(currentWeather, forecastData, airQuality);
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
    }
};

// 启动应用
WeatherApp.init();