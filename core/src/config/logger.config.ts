import { WinstonModuleOptions } from 'nest-winston';
import { format, transports } from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const loggerConfig: WinstonModuleOptions = {
    transports: [
        process.env.NODE_ENV === 'development'
            ? new transports.Console({
                  format: format.combine(
                      format.timestamp(),
                      nestWinstonModuleUtilities.format.nestLike('App', {
                          colors: true,
                          prettyPrint: true,
                      }),
                  ),
              })
            : null,
    ],
};

export default loggerConfig;
