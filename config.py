class Config:
    SECRET_KEY = '41ZHx0}*fJ6xO:Xui0t]&I^P~IHgBa/k'


class DevelopmentConfig(Config):
    DEBUG = True
    SESSION_TYPE = 'filesystem'
    #DATABASE_URI = 'mysql://user@localhost/foo'    


class ProductionConfig(Config):
    DEBUG = False
    SESSION_TYPE = 'filesystem'
    #DATABASE_URI = "sqlite:////tmp/foo.db"


config =  {
    'dev': DevelopmentConfig,
    'prod': ProductionConfig,
}