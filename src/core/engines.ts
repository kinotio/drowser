import { Builder } from '@deps';
import { buildBrowerType } from '@constants';

const chromeEngine = () => {
	new Promise((resolve) => {
		const builder = new Builder().forBrowser(buildBrowerType.chrome).build();
		builder.then(() => {
			resolve(builder);
		}).catch(() => {
			throw new Error('A error occurred while building chrome engine');
		});
	});
};

const safariEngine = () => {
	new Promise((resolve) => {
		const builder = new Builder().forBrowser(buildBrowerType.safari).build();
		builder.then(() => {
			resolve(builder);
		}).catch(() => {
			throw new Error('A error occurred while building chrome engine');
		});
	});
};

const firefoxEngine = () => {
	new Promise((resolve) => {
		const builder = new Builder().forBrowser(buildBrowerType.firefox).build();
		builder.then(() => {
			resolve(builder);
		}).catch(() => {
			throw new Error('A error occurred while building chrome engine');
		});
	});
};

export { chromeEngine, firefoxEngine, safariEngine };
