from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import Text
from sqlalchemy.sql import func

from database.database import Base


class ScanResult(Base):
    __tablename__ = "scan_results"

    id = Column(Integer, primary_key=True, index=True)

    description = Column(Text, nullable=False)

    claims = Column(Text)

    behavior = Column(Text)

    hidden_behaviors = Column(Text)

    risk_score = Column(Integer)

    status = Column(String(20))

    explanation = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )